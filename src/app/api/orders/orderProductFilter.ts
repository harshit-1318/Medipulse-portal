const CATEGORY_REGEX_MAP: Record<string, string> = {
  'weight-loss': 'wegovy|weight|obesity|semaglutide|injectable|mounjaro|tirzepatide|zepbound|ozempic|rybelsus|saxenda|mysimba|xenical|orlistat',
  'ed': 'sildenafil|tadalafil|viagra|cialis|levitra|spedra|vardenafil',
  'acne': 'acne|pimple|retinoid|duac|differin|epiduo|lymecycline',
  'migraine': 'sumatriptan|zolmitriptan|rizatriptan|almogran|maxalt|zomig|migraine|headache',
  'asthma': 'salbutamol|ventolin|salamol|clenil|seretide|symbicort|inhaler|asthma',
  'eczema-dermatitis': 'hydrocortisone|betnovate|eumovate|dermovate|fucidin|eczema|dermatitis',
  'jet-lag-treatment': 'melatonin|circadin|jet lag',
  'jet-lag': 'melatonin|circadin|jet lag',
  'mens-hair-loss': 'finasteride|propecia|minoxidil|regaine|hair',
  'hair-loss': 'finasteride|propecia|minoxidil|regaine|hair',
  'period-delay': 'norethisterone|utovlan|period|delay',
  'acid-reflux': 'omeprazole|lansoprazole|pantoprazole|esomeprazole|nexium|acid|reflux|heartburn',
  'joint-pain': 'naproxen|diclofenac|ibuprofen|voltarol|joint|arthritis',
  'bacterial-vaginosis': 'metronidazole|zidoval|dalacin|canesten|vaginosis|bv',
};

export function applyProductAndDocFilters(query: Record<string, any>, searchParams: URLSearchParams, andClauses?: Record<string, any>[]): void {
  const targetAnd: Record<string, any>[] = andClauses || query.$and || [];

  // Product Category
  const cat = (searchParams.get('product_category') || searchParams.get('category') || searchParams.get('productCategory') || '').toLowerCase().trim();
  if (cat && cat !== 'all') {
    const pattern = CATEGORY_REGEX_MAP[cat] || cat;
    targetAnd.push({
      $or: [
        { tags: { $regex: cat, $options: 'i' } },
        { 'items.name': { $regex: pattern, $options: 'i' } },
      ],
    });
  }

  // Product Type (injectable, oral, etc.)
  const prodType = (searchParams.get('product_type') || searchParams.get('products') || searchParams.get('productType') || '').toLowerCase().trim();
  if (prodType && prodType !== 'all') {
    let typePattern = prodType;
    if (prodType === 'injectable') {
      typePattern = 'pen|flextouch|inject|semaglutide|tirzepatide|wegovy|ozempic|mounjaro|zepbound|saxenda';
    } else if (prodType === 'oral') {
      typePattern = 'tablet|capsule|pill|oral|sildenafil|finasteride|tadalafil|orlistat|xenical|rybelsus';
    }
    targetAnd.push({ 'items.name': { $regex: typePattern, $options: 'i' } });
  }

  // Product Name
  const prodName = (searchParams.get('productName') || searchParams.get('product_name') || searchParams.get('product') || '').trim();
  if (prodName) {
    targetAnd.push({
      $or: [
        { 'items.name': { $regex: prodName, $options: 'i' } },
        { tags: { $regex: prodName, $options: 'i' } },
      ],
    });
  }

  // Documents
  const docStatus = (searchParams.get('documentStatus') || searchParams.get('documents') || '').toLowerCase().trim();
  if (docStatus && docStatus !== 'all') {
    if (docStatus === 'uploaded') {
      targetAnd.push({
        $or: [
          { hasIdCard: true },
          { hasFullPhoto: true },
          { documentsUploaded: true },
          { documentStatus: 'uploaded' },
          { tags: { $in: ['prescription_uploaded', 'documents_uploaded', 'uploaded'] } },
        ],
      });
    } else if (docStatus === 'not_uploaded' || docStatus === 'not uploaded') {
      targetAnd.push({
        hasIdCard: { $ne: true },
        hasFullPhoto: { $ne: true },
        documentsUploaded: { $ne: true },
        documentStatus: { $ne: 'uploaded' },
        tags: { $nin: ['prescription_uploaded', 'documents_uploaded', 'uploaded'] },
      });
    }
  }

  if (!andClauses && targetAnd.length > 0) {
    query.$and = targetAnd;
  }
}
