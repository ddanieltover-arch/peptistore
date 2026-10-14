export type KeywordClusterPost = {
  title: string;
  slug: string;
  publishedAt: string;
  imagePath: string;
  content: string;
};

const DISCLAIMER = `

---

*Research Peptides UK supplies compounds strictly for **in vitro and non-clinical laboratory research**. Products are not medicines, are not intended for human or veterinary use, and must not be used for diagnosis, treatment, or consumption. Researchers are responsible for compliance with local laws and institutional protocols.*`;

export const KEYWORD_CLUSTER_POSTS: KeywordClusterPost[] = [
  {
    title: 'How UK Laboratories Review Peptide COA References',
    slug: 'how-uk-laboratories-review-peptide-coa-references',
    publishedAt: '2026-08-18T09:15:00.000Z',
    imagePath: '/blog/custom-peptide-synthesis.png',
    content: `**Quick Answer:** Peptide testing in a UK laboratory starts with the Certificate of Analysis, not a marketing claim. Review the batch ID, test date, method, and purity figure, then match that record to the vial before the material enters a non-clinical workflow.

## Why COA Review Comes Before the Assay

A catalogue title tells you the compound name. A COA tells you what was actually released for that batch. UK research groups use that distinction when they compare suppliers, because two vials with the same peptide name can differ in purity, counter-ion, and documentation quality.

This article is the review checklist. Batch records for selected lines are collected in the [COA library](/coas). Ordering still happens on the [research catalogue](/shop).

## What to Read on a Peptide COA

Work down the document in the same order every time:

1. **Identity.** The peptide name, sequence or catalogue code, and any modification should match the product page you intend to use.
2. **Batch ID.** Copy it into the laboratory notebook. Later questions about purity only make sense against that ID.
3. **Test date.** An undated chromatogram is weaker evidence than a report tied to a day and a method.
4. **Method.** HPLC or UPLC purity, and mass confirmation where the supplier provides it, should be named rather than implied.
5. **Result.** Record the main-peak purity and any stated limits. Do not treat a single percentage as a substitute for the chromatogram.

If the public page shows a summary and the full PDF is not attached, request the pack through [contact](/contact) before the material is assigned to an experiment.

## How This Differs From “Tested Peptides” Marketing

“Tested” only means something when the test is identifiable. A useful record names the batch, the method, and the date. A badge without those fields does not help an auditor or a notebook.

External method context lives in the literature, including records indexed on [PubMed](https://pubmed.ncbi.nlm.nih.gov/). Published papers describe analytical practice. They do not certify a commercial vial. Your own SOP decides whether an in-house HPLC or mass check is required after the supplier COA.

## A Practical Review Sequence

- Open the product page and note the exact compound and vial size.
- Open the matching COA row in the [COA library](/coas), or request it.
- Confirm batch ID, date, method, and result against the label you expect to receive.
- File the PDF with the purchase record.
- Release the vial to the bench only after that match is written down.

Storage and dispatch limits are on the [shipping](/shipping) and [FAQ](/faq) pages. Handling basics for new groups are in the [peptide guide](/peptide-guide).

## FAQs

### Does a COA replace in-house testing?

No. It is the supplier’s batch record. Many laboratories still run their own identity or purity check when the protocol requires it.

### What if the online library only shows a summary?

Ask support for the full report and wait for the batch ID before you treat the summary as complete.

### Are these compounds for human use?

No. Catalogue peptides and their COA files are for non-clinical laboratory research. See the [terms](/terms).

## Next Step

Shortlist the compound on the [shop](/shop), then verify the batch in the [COA library](/coas) before it is logged into a study.${DISCLAIMER}`,
  },
  {
    title: 'Bacteriostatic Water and Bacteriostatic Saline for Laboratory Dilution',
    slug: 'bacteriostatic-water-and-bacteriostatic-saline-for-laboratory-dilution',
    publishedAt: '2026-08-28T11:40:00.000Z',
    imagePath: '/blog/reception-lobby.png',
    content: `**Quick Answer:** Bacteriostatic water and bacteriostatic saline are different laboratory diluents. The water listing is the benzyl-alcohol research diluent. The saline listing is 0.9% sodium chloride. Choose the one named in the protocol, and keep both on research-only terms.

## Two Listings, Two Formulations

People searching for bacteriostatic water for peptide work are often looking for a diluent, then land on a vial that is actually saline, or the reverse. The catalogue separates them:

- [Bacteriostatic water](/product/bacteriostatic-water) for the standard research diluent listing.
- [Hospira bacteriostatic water](/product/bacteriostatic-water-0-9-benzyl-alcohol-10ml-hospira-injection-usp) when the requirement is the 10ml benzyl-alcohol Hospira line.
- [Bacteriostatic saline](/product/bacteriostatic-water-0-9-sodium-chloride-10ml-hospira-usp-injection) for 0.9% sodium chloride.

Read the label text, not only the word “bacteriostatic.” That word describes a preserved aqueous product. It does not tell you whether the vial is water with benzyl alcohol or sodium chloride solution.

## What Laboratories Compare

Before a diluent is written into a method, record:

- **Solute.** Benzyl-alcohol water versus 0.9% sodium chloride.
- **Volume.** The 10ml listings are size-specific. Do not assume every “bac water” search result is 10ml.
- **Brand line.** Hospira wording belongs on the Hospira SKU only.
- **Intended use.** These vials support non-clinical laboratory dilution. They are not a clinical water-for-injection guide.

Institutional SOPs decide reconstitution media, volumes, and whether a preserved diluent is acceptable in a given assay. This site does not publish preparation volumes or administration instructions.

## Which Listing Matches the Request

“Bacteriostatic water” is answered by the [water product page](/product/bacteriostatic-water). This article exists so a researcher can see why saline is a separate line, and when the Hospira benzyl-alcohol listing is the one that matches a purchasing spec.

If a paper or internal method says “bacteriostatic saline” or “0.9% sodium chloride,” use the saline page. If it says Hospira bacteriostatic water, use the Hospira benzyl-alcohol page and check the batch record.

## Documentation and Storage

Treat diluents like any other catalogue material:

1. Match the product title to the purchasing request.
2. File the batch reference with the peptide batch it will be used beside.
3. Store according to the label and your SOP, not according to a forum note.
4. Keep research-only restrictions visible in the notebook. The [terms](/terms) state that catalogue goods are not for human or veterinary use.

Cold-chain notes for peptides themselves are on [shipping](/shipping). Diluent questions that are really documentation questions can go through [contact](/contact).

## FAQs

### Is bacteriostatic saline the same as bacteriostatic water?

No. Saline here is 0.9% sodium chloride. Bacteriostatic water is the separate diluent listing. Confirm which phrase your protocol uses.

### Should every peptide be diluted with bacteriostatic water?

No. The method owner chooses the diluent. Some assays specify a buffer, sterile water, or saline. Follow the SOP.

### Where is the 10ml Hospira listing?

On the [Hospira bacteriostatic water](/product/bacteriostatic-water-0-9-benzyl-alcohol-10ml-hospira-injection-usp) page, not on the generic water page and not on the saline page.

## Next Step

Open the listing that matches the formulation you were asked to buy, then confirm batch details before the vial is released to the bench.${DISCLAIMER}`,
  },
  {
    title: 'CJC-1295 with DAC Compared with the No-DAC Ipamorelin Blend',
    slug: 'cjc-1295-with-dac-compared-with-the-no-dac-ipamorelin-blend',
    publishedAt: '2026-09-08T14:05:00.000Z',
    imagePath: '/blog/reception-wide.png',
    content: `**Quick Answer:** CJC-1295 with DAC and the CJC-1295 no-DAC plus ipamorelin blend are different catalogue entries. DAC is a compound form. The blend is a combined research vial. Order the page that matches the material named in the laboratory plan.

## Why These Searches Collapse Together

Researchers often type “CJC-1295 ipamorelin,” “CJC-1295 DAC,” and “CJC no DAC” as if they were one SKU. They are not. Mixing them in a purchasing cart creates a documentation problem later, because the batch record will not match the protocol name.

Use these two pages:

- [CJC-1295 no DAC with ipamorelin](/product/cjc-1295-no-dac-5mg-ipamorelin-5mg-10mg-total-peptide-blend) for the combined blend.
- [CJC-1295 with DAC](/product/cjc-1295-with-dac) for the DAC listing.

A 2mg DAC vial, where stocked, is a size of the DAC compound. It is not a substitute name for the ipamorelin blend.

## What Changes Between the Listings

Compare three fields before you raise a purchase order:

1. **Composition.** The blend page states both CJC-1295 no DAC and ipamorelin. The DAC page does not add ipamorelin by default.
2. **Name on the COA.** The analytical record should use the same identity as the page you bought.
3. **Vial mass.** Read the milligram amount on that SKU. A different size page is a different listing, even when the peptide name looks similar.

This comparison does not rank the materials for performance, sport, or clinical effect. Both are supplied for non-clinical laboratory research. Pathway context for GH-axis peptides sits with the [peptide research briefs](/peptide-research), not with a dosing table.

## How to Choose a Page Without a Protocol Rewrite

- If the method says CJC-1295 and ipamorelin together, start with the blend page and check that both names appear in the title and the batch record.
- If the method says CJC-1295 with DAC, start with the DAC page and do not add the blend because the names share “CJC.”
- If the method says no DAC and does not mention ipamorelin, do not assume the blend is correct. Confirm the exact SKU with the method owner.

GHRP-2 is a further GH-axis listing and lives on its own page, [GHRP-2 acetate](/product/ghrp-2-acetate). It is not part of either CJC SKU.

## Documentation

File the product title, vial size, and batch ID together. Request COA detail from the [COA library](/coas) or [contact](/contact) when the public summary is not enough for your notebook. Research-only limits are in the [terms](/terms).

## FAQs

### Does “CJC-1295 ipamorelin” include DAC?

The blend page is the no-DAC ipamorelin combination. DAC is the other listing. Read the title before you order.

### Can the 2mg DAC vial replace the blend?

No. Different composition and, where the 2mg page is in stock, a stated size of the DAC compound only.

### Are handling volumes published here?

No. Dilution and any experimental amounts belong in the institutional SOP. The catalogue identifies the material.

## Next Step

Open the [no-DAC ipamorelin blend](/product/cjc-1295-no-dac-5mg-ipamorelin-5mg-10mg-total-peptide-blend) or the [CJC-1295 DAC listing](/product/cjc-1295-with-dac), then match the COA identity to the protocol name.${DISCLAIMER}`,
  },
  {
    title: 'IGF-1 LR3 and IGF-1 DES: Separate Research Listings',
    slug: 'igf-1-lr3-and-igf-1-des-separate-research-listings',
    publishedAt: '2026-09-18T10:20:00.000Z',
    imagePath: '/blog/igf-1-peptide.png',
    content: `**Quick Answer:** IGF-1 LR3 and IGF-1 DES are different research listings. LR3 is not a spelling of DES, and a 1mg vial is a size of one of those listings, not a third peptide. Order the page whose name matches the method.

## Three Names That Should Stay Apart

Search variants such as “igf1 lr3,” “igf-1lr3,” and “igf1 des” all point back to two compounds plus their vial sizes:

- [IGF-1 LR3](/product/igf-1-lr3) for the LR3 listing.
- [IGF-1 DES](/product/igf-des) for the DES listing.
- [IGF-1 peptide](/product/igf-1-1-3-1mg) for the separate non-LR3, non-DES catalogue entry.

A 1mg LR3 vial and a 1mg DES vial keep the size in the title. They should not be purchased as if they were the unsized listing under another spelling.

## What to Compare

Use the product title as the identity check:

1. **Variant.** LR3, DES, or the other IGF-1 entry.
2. **Mass.** 1mg pages are size listings. Record the mass in the purchasing note.
3. **Batch record.** The COA name should match the variant you selected, not a shortened “IGF” label.
4. **Use limit.** All of these lines are for non-clinical laboratory research. This article does not provide experimental doses or administration steps.

Literature on IGF-axis models can be searched on [PubMed](https://pubmed.ncbi.nlm.nih.gov/). A paper is not a specification for the vial in your freezer. Your SOP is.

## Why the Catalogue Does Not Use One IGF Title

A single title such as “IGF-1 peptide” on every variant makes the wrong vial look correct. The listings are split so LR3, DES, and the other IGF-1 entry can be checked independently. When you write a method, use the full variant name.

Related pathway notes, without collapsing those SKUs, are on the [peptide research](/peptide-research) page. Category browsing is on [UK research peptide categories](/categories).

## Receiving Check

When the parcel arrives:

- Read the vial label next to the purchase order.
- Confirm LR3 versus DES before the vial is stored with other IGF material.
- Attach the batch ID to that line in the notebook.
- Hold the material if the variant does not match. [Contact](/contact) support with the batch ID rather than relabelling it locally.

## FAQs

### Is IGF-1 LR3 the same product as IGF-1 DES?

No. They are separate catalogue listings. Spelling differences such as “igf1lr3” still refer to the LR3 page, not to DES.

### What is the 1mg page for?

It is the sized vial of that variant. The unsized LR3 and DES pages remain the main listings for those names.

### Where do I review purity notes?

Start with the [COA library](/coas) and the batch ID on the listing you bought.

## Next Step

Choose [IGF-1 LR3](/product/igf-1-lr3) or [IGF-1 DES](/product/igf-des) according to the method name, then file the batch record before the vial is used.${DISCLAIMER}`,
  },
  {
    title: 'GHK-Cu, BPC-157 and TB-500 in a Glow Research Blend',
    slug: 'ghk-cu-bpc-157-and-tb-500-in-a-glow-research-blend',
    publishedAt: '2026-09-29T16:30:00.000Z',
    imagePath: '/blog/kpv-peptide.png',
    content: `**Quick Answer:** The glow peptide listing is a research blend of GHK-Cu, BPC-157 and TB-500 in one vial. It is not a general name for every copper peptide or every BPC-157 product. Read the three components on the blend page before you order.

## What the Glow Listing Contains

The [glow peptide blend](/product/glow-blend-ghk-cu-bpc157-tb500) is defined by its composition: GHK-Cu, BPC-157, and TB-500. Related searches such as “glow peptides,” “glow blend,” and “glow GHK-Cu” are the same blend, not extra products.

That matters when a laboratory already stocks a single component. Standalone [BPC-157](/product/bpc-157) is a different listing. A BPC-157 and TB-500 blend without GHK-Cu is also different: see the [BPC-157 TB-500 blend](/product/bpc-10mg-tb-10mg-20mg-peptide-blend). Ordering “glow” when the method names only BPC-157 will put the wrong identity on the COA.

## How to Read the Blend Page

Check these items on the listing and again on the documents:

- **All three names** appear on the product you add to the order.
- **The vial you receive** matches that composition, not a single-peptide label.
- **The batch record** repeats the blend identity. A COA that names only one of the three components is a mismatch.
- **Other “glow” packaging**, including pens or multi-vial packs if they appear in the catalogue, is not automatically this vial. Match the title.

No cosmetic, recovery, or performance claim belongs in the purchasing note. The blend is supplied for non-clinical laboratory research under the [terms](/terms).

## Blend Versus Single Components

Choose the blend when the method or the purchasing spec asks for GHK-Cu with BPC-157 and TB-500 together. Choose a single-component or two-component page when the spec names fewer materials.

Writing “glow” in a notebook without the three component names makes later review harder. Record the full product title and the batch ID. Summaries of batch testing sit in the [COA library](/coas).

## What This Article Does Not Set

It does not set reconstitution volumes, frequencies, or any use outside laboratory research. Those decisions stay in the institutional SOP. Diluent choice, if a method needs one, is discussed separately in the bacteriostatic water and saline guide, and the vials themselves are individual catalogue lines.

## FAQs

### Is every GHK-Cu product a glow blend?

No. The glow listing is the three-component blend. A GHK-Cu vial without BPC-157 and TB-500 is a different product.

### Is the BPC-157 TB-500 blend the same as glow?

No. Glow adds GHK-Cu. The BPC/TB blend page does not replace it.

### Can this be used in people or animals?

No. It is for non-clinical laboratory research only.

## Next Step

Open the [glow blend](/product/glow-blend-ghk-cu-bpc157-tb500), confirm all three components, and keep that title next to the batch ID in the laboratory record.${DISCLAIMER}`,
  },
  {
    title: 'NAD 500mg and NAD 250mg Research Vial Sizes',
    slug: 'nad-500mg-and-nad-250mg-research-vial-sizes',
    publishedAt: '2026-10-08T08:50:00.000Z',
    imagePath: '/blog/storefront-night.png',
    content: `**Quick Answer:** The NAD peptide listing for general catalogue searches is the 500mg research vial. The 250mg vial is a smaller size with its own page. Record the mass you purchase so the batch record matches the amount the method expected.

## Why Size Is Part of the Identity

“NAD peptide,” “NAD+ peptide,” and “buy NAD” are usually the same purchasing intent with different wording. The catalogue answers that intent on the [NAD 500mg page](/product/nad-500mg). The [NAD 250mg page](/product/nad-250mg) exists so a smaller vial is not silently substituted.

A generic NAD catalogue row, where it is present, is not a third strength. Use the page that states 500mg or 250mg.

## What to Write on the Order

Before checkout, the purchasing note should include:

1. **Compound.** NAD, as named on the listing.
2. **Mass.** 500mg or 250mg.
3. **Batch expectation.** You will match the COA to that exact line after delivery.
4. **Use limit.** Non-clinical laboratory research only. This page is not a dosing schedule and not a clinical NAD protocol.

If an internal method specifies a molar amount or a buffer, convert that requirement inside the SOP. Do not treat the vial mass as an experimental dose.

## 500mg Versus 250mg

The 500mg listing is the main NAD peptide page. Choose 250mg when the method or the stock rotation calls for the smaller mass. Do not order both and decide later which label to trust. The COA should name the mass you received.

Review batch fields the same way as any other peptide: identity, batch ID, test date, method, and result. Start from the [COA library](/coas) or request the pack via [contact](/contact).

## Related Catalogue Lines

NAD is not a GLP-axis peptide and it is not a diluent. Bacteriostatic water, if a method requires a diluent at all, is a separate decision and a separate product. Pathway background for other compounds stays on [peptide research](/peptide-research). The wider range is on the [shop](/shop).

## FAQs

### Is NAD 250mg half of the 500mg listing for documentation purposes?

It is a different vial size and should keep its own batch record. Do not file a 250mg COA against a 500mg order line.

### Does “NAD+ peptide” need its own page?

Those wordings point at the same 500mg research listing. The 250mg page remains the size alternative.

### Are administration amounts provided?

No. Experimental design stays with the laboratory. The catalogue identifies the vial.

## Next Step

Open [NAD 500mg](/product/nad-500mg) or [NAD 250mg](/product/nad-250mg), then store the batch ID with that mass before the material is booked into an experiment.${DISCLAIMER}`,
  },
];
