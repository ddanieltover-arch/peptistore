import { pool } from '../db.js';
import { ScraperEngine } from '../scraper/engine.js';
import { normalizeProduct } from '../scraper/normalizer.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console({ format: winston.format.simple() })]
});

export class ScrapeQueueWorker {
  private isRunning = false;
  private pollInterval = 5000;
  private scraper: ScraperEngine;

  constructor() {
    this.scraper = new ScraperEngine();
  }

  async start() {
    this.isRunning = true;
    logger.info('Started Postgres-backed Scrape Queue Worker');
    await this.scraper.init();
    this.poll();
  }

  async stop() {
    this.isRunning = false;
    await this.scraper.close();
    logger.info('Stopped Queue Worker');
  }

  private async poll() {
    if (!this.isRunning) return;

    try {
      const job = await this.getNextJob();
      if (job) {
        await this.processJob(job);
      }
    } catch (error) {
      logger.error('Error polling for jobs:', error);
    }

    setTimeout(() => this.poll(), this.pollInterval);
  }

  private async getNextJob() {
    // Uses FOR UPDATE SKIP LOCKED to act as a concurrent queue
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(`
        SELECT id, type, payload
        FROM scrape_queue
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      `);

      if (rows.length === 0) {
        await client.query('COMMIT');
        return null;
      }

      const job = rows[0];
      await client.query(
        `UPDATE scrape_queue SET status = 'processing', started_at = NOW() WHERE id = $1`,
        [job.id]
      );
      await client.query('COMMIT');
      return job;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async processJob(job: any) {
    logger.info(`Processing job ${job.id} of type ${job.type}`);
    
    try {
      if (job.type === 'SCRAPE_PRODUCT') {
        const url = job.payload.url;
        if (!url) throw new Error('Missing URL in payload');
        
        const rawProduct = await this.scraper.scrapeProductPage(url);
        if (rawProduct) {
          const normalized = normalizeProduct(rawProduct);
          logger.info(`Persisting Product: ${normalized.name}`);
          
          await pool.query('BEGIN');
          try {
            // 1. Handle Category (Simple lookup/insert)
            let categoryId = null;
            if (normalized.category) {
              const catSlug = normalized.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const catRes = await pool.query(
                `INSERT INTO scrape_categories (name, slug) 
                 VALUES ($1, $2) 
                 ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name 
                 RETURNING id`,
                [normalized.category, catSlug]
              );
              categoryId = catRes.rows[0].id;
            }

            // 2. Upsert Product
            const productRes = await pool.query(
              `INSERT INTO scrape_products (
                name, description, base_price_gbp, original_price, 
                original_currency, source_url, category_id, thumbnail_url
              ) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              ON CONFLICT (source_url) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                base_price_gbp = EXCLUDED.base_price_gbp,
                original_price = EXCLUDED.original_price,
                thumbnail_url = EXCLUDED.thumbnail_url,
                updated_at = NOW()
              RETURNING id`,
              [
                normalized.name,
                normalized.description,
                normalized.price_gbp,
                normalized.original_price,
                normalized.original_currency,
                normalized.url,
                categoryId,
                normalized.images[0] || null
              ]
            );
            const productId = productRes.rows[0].id;

            // 3. Sync Images
            if (normalized.images && normalized.images.length > 0) {
              for (const [index, imgUrl] of normalized.images.entries()) {
                await pool.query(
                  `INSERT INTO scrape_product_images (product_id, url, position, is_thumbnail)
                   VALUES ($1, $2, $3, $4)
                   ON CONFLICT (product_id, url) DO NOTHING`,
                  [productId, imgUrl, index, index === 0]
                );
              }
            }

            await pool.query('COMMIT');
            logger.info(`Successfully persisted product ${normalized.name} (ID: ${productId})`);
          } catch (dbError) {
            await pool.query('ROLLBACK');
            throw dbError;
          }
        } else {
          throw new Error('Failed to extract product data');
        }
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      // Mark success
      await pool.query(
        `UPDATE scrape_queue SET status = 'completed', completed_at = NOW() WHERE id = $1`,
        [job.id]
      );
      logger.info(`Job ${job.id} completed successfully`);

    } catch (error: any) {
      logger.error(`Job ${job.id} failed:`, error);
      await pool.query(
        `UPDATE scrape_queue SET status = 'failed', completed_at = NOW(), error_log = $2 WHERE id = $1`,
        [job.id, error.message || error.toString()]
      );
    }
  }
}
