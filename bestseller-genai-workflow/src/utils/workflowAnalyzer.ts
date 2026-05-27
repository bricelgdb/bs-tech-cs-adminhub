import { AnalysisRequest, GeneratedWorkflow, WorkflowCategory, WorkflowStep, CostEstimate, AlternativeRoute } from '../types';
import { format } from 'date-fns';

let idCounter = 1;
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${idCounter++}`;
}

function detectCategory(input: string): WorkflowCategory {
  const lower = input.toLowerCase();
  if (/video|film|reel|motion|cinematic|moving/.test(lower)) return 'video-concept';
  if (/locali|adapt.*market|market.*adapt|spain|france|norway|germany|uk\b|global|multimarket|multilanguage/.test(lower)) return 'market-localization';
  if (/ecom|product.*shot|product.*image|pdp|product page|listing|catalogue|catalog/.test(lower)) return 'ecommerce-imagery';
  if (/social|instagram|tiktok|post|story|stories|reel/.test(lower)) return 'social-campaign';
  if (/variation|variations|generate.*image|batch|multiple version/.test(lower)) return 'batch-variation';
  if (/storytell|narrative|brand story|lookbook|editorial/.test(lower)) return 'product-storytelling';
  if (/campaign|editorial|hero|launch|collection|season/.test(lower)) return 'editorial-campaign';
  return 'editorial-campaign';
}

function buildSocialCampaignWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Creative Brief & Copy Generation',
      description: `Use ChatGPT 4o to develop campaign messaging, captions, hashtags, and copy adapted for ${req.brand}. Generate platform-specific variations for each market: ${req.markets.join(', ')}.`,
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Campaign brief', 'Brand guidelines', 'Target markets', 'Platform specs'],
      outputProduced: ['Campaign headlines', 'Platform captions (IG/TikTok/LinkedIn)', 'Hashtag sets per market', 'Tone-of-voice brief'],
      estimatedMinutes: 20,
      estimatedCostUSD: 0.50,
      promptingGuidance: `Prompt: "You are a senior copywriter for ${req.brand} at BESTSELLER. Write [platform] captions for a [season/theme] campaign targeting [market]. Maintain [brand voice]. Include localized hashtags, cultural references appropriate for [market], and a clear CTA. Output in [language]."`,
      qualityRisks: ['Cultural nuance may need human review for each market', 'Tone-of-voice drift across markets'],
      notes: 'Reuse structured output as prompt seeds for image generation in Step 2.',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Hero Image Generation',
      description: `Generate campaign hero visuals using Midjourney v6 with ${req.brand} style references. Create 4 initial concepts, select best 2, upscale to production quality.`,
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6 (--style raw)',
      inputRequired: ['Campaign copy brief', 'Brand visual references', 'Product samples or mood board'],
      outputProduced: ['4× concept images at 1024px', '2× upscaled hero images at 4K'],
      estimatedMinutes: 30,
      estimatedCostUSD: 0.80,
      promptingGuidance: `Prompt structure: "/imagine [brand aesthetic description], [model/setting description], [lighting style], [color palette], [campaign mood] --ar 4:5 --sref [style_reference_url] --style raw --v 6"`,
      qualityRisks: ['Exact product replication not guaranteed', 'Model likeness requires human QA', 'Brand color accuracy may need post-processing'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'Asset Adaptation & Sizing',
      description: 'Import hero images into Adobe Express. Use brand kit to apply logo, typography, and brand colors. Batch-resize for all required social formats: feed, story, square, landscape.',
      toolId: 'adobe-express',
      inputRequired: ['Hero images from Step 2', 'Brand kit', 'Platform size specs'],
      outputProduced: ['IG Feed (4:5, 1:1)', 'IG/TikTok Story (9:16)', 'LinkedIn Banner (16:9)', 'Facebook Feed (1.91:1)'],
      estimatedMinutes: 25,
      estimatedCostUSD: 0.20,
      promptingGuidance: 'Use Adobe Express Resize Magic to auto-adapt compositions. Apply brand kit for logo placement and typography. Use AI text generation for localised overlay copy.',
      qualityRisks: ['Auto-resize may require manual crop adjustment for key subjects', 'Font rendering check needed per locale'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Market Localisation',
      description: `For each market (${req.markets.join(', ')}): adapt copy overlays, translate text elements, and adjust visual cues. Use Adobe Firefly Generative Fill for background/environment adaptations.`,
      toolId: 'adobe-firefly',
      modelVariant: 'Firefly Image 3',
      inputRequired: ['Sized assets from Step 3', 'Localised copy from Step 1', 'Market-specific visual guidelines'],
      outputProduced: [`Full localised asset set ×${req.markets.length} markets`, 'Platform-ready files per market'],
      estimatedMinutes: req.markets.length * 15,
      estimatedCostUSD: req.markets.length * 0.80,
      promptingGuidance: 'Use Generative Fill to swap background environments (urban Paris vs Oslo winter) while keeping product/model consistent. Use Generative Expand for different crops.',
      qualityRisks: ['Background context changes may affect brand consistency', 'Cultural imagery review mandatory before publishing'],
    },
    {
      id: generateId('step'),
      stepNumber: 5,
      title: 'Review & Approval (Weavy)',
      description: 'Upload all market asset sets to Weavy collaborative review workspace. Brand managers and market leads review, comment, and approve. Track version status per market.',
      toolId: 'weavy',
      inputRequired: ['All localised asset sets', 'Reviewer access list', 'Approval criteria checklist'],
      outputProduced: ['Approved asset sets per market', 'Revision notes', 'Audit trail'],
      estimatedMinutes: 60,
      estimatedCostUSD: 0,
      notes: 'Weavy cost absorbed in platform subscription. Target 24–48h review cycle.',
      qualityRisks: ['Review bottleneck if approvers unavailable', 'Version confusion without strict naming convention'],
    },
  ];
}

function buildEcomWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Product Brief & Shot List',
      description: 'Generate structured shot list and product descriptions using ChatGPT 4o. Define required angles, background styles, and e-commerce platform specifications.',
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Product catalogue data', 'E-com platform requirements', 'Brand guidelines'],
      outputProduced: ['Shot list per SKU', 'Product copy per market', 'Technical specs sheet'],
      estimatedMinutes: 15,
      estimatedCostUSD: 0.30,
      promptingGuidance: 'Prompt: "Create a comprehensive shot list for [product type] for [brand] e-commerce. Include: ghost mannequin, flat lay, lifestyle, detail shots. Format as structured table with angle, background, lighting, and model requirement columns."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Background & Environment Generation',
      description: 'Generate clean, on-brand product backgrounds using Adobe Firefly. Create multiple background variants: studio white, lifestyle context, seasonal settings.',
      toolId: 'adobe-firefly',
      modelVariant: 'Firefly Image 3 + Generative Fill',
      inputRequired: ['Existing product samples or swatch images', 'Brand background guidelines'],
      outputProduced: ['Studio white backgrounds', 'Lifestyle context backgrounds', 'Seasonal background variants'],
      estimatedMinutes: 20,
      estimatedCostUSD: 1.20,
      promptingGuidance: 'Use Generative Fill to place products on generated backgrounds. Style prompts: "minimal white studio, soft shadow, luxury fashion photography" or "Scandinavian interior, natural light, lifestyle fashion context"',
      qualityRisks: ['Shadow and lighting consistency across SKUs', 'Product color accuracy on generated backgrounds'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'AI Product Image Generation & Variation',
      description: 'Generate product styling variations using Midjourney for lifestyle hero shots. Create on-model, ghost mannequin, and styled flat lay variants.',
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6',
      inputRequired: ['Product reference images', 'Model style direction', 'Background preferences'],
      outputProduced: ['On-model lifestyle shots', 'Ghost mannequin views', 'Detail close-ups', '4–8 variants per key product'],
      estimatedMinutes: 45,
      estimatedCostUSD: 2.00,
      promptingGuidance: 'Use --cref for consistent model, --sref for consistent brand aesthetic. Prompt: "professional fashion product photography, [product], [brand] aesthetic, clean studio light, --ar 3:4 --sref [ref] --cref [model_ref]"',
      qualityRisks: ['Ghost mannequin seam accuracy limited', 'Exact SKU replication requires careful prompting and QA'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Retouching & Finalisation',
      description: 'Import AI-generated images into Photoshop AI. Apply Generative Fill for product corrections, remove imperfections, ensure color accuracy, add shadows.',
      toolId: 'adobe-photoshop-ai',
      modelVariant: 'Photoshop AI + Firefly',
      inputRequired: ['Raw AI-generated images', 'Brand color swatches', 'Retouching brief'],
      outputProduced: ['Retouched, print-ready product images', 'Web-optimised variants', 'Transparent PNG versions'],
      estimatedMinutes: 30,
      estimatedCostUSD: 0.60,
      qualityRisks: ['AI retouching may alter texture details', 'Manual QA required for fashion-grade finish'],
    },
    {
      id: generateId('step'),
      stepNumber: 5,
      title: 'E-com Platform Export & Review',
      description: 'Use Adobe Express to format assets to e-com platform specifications. Apply consistent naming, metadata, and alt-text. Submit via Weavy for final commercial approval.',
      toolId: 'adobe-express',
      inputRequired: ['Retouched images', 'Platform upload specifications', 'SEO metadata'],
      outputProduced: ['Platform-ready JPG/PNG files', 'Named and tagged asset package', 'Approved asset set'],
      estimatedMinutes: 20,
      estimatedCostUSD: 0.10,
    },
  ];
}

function buildVideoWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Video Concept & Script',
      description: 'Develop video concept, shot sequence, and script/voiceover using ChatGPT 4o. Define motion direction, mood, music brief, and platform-specific durations.',
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Campaign brief', 'Brand tone guide', 'Platform requirements (TikTok/Reels/YouTube)'],
      outputProduced: ['Video concept document', 'Shot-by-shot storyboard text', 'Voiceover script per market', 'Music mood brief'],
      estimatedMinutes: 25,
      estimatedCostUSD: 0.40,
      promptingGuidance: 'Prompt: "Create a 15-second video concept for [brand] [collection] campaign. Platform: [platform]. Mood: [mood]. Include: opening hook, 3 product moments, brand close. Format as shot list with motion direction and copy overlay per shot."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Hero Still Generation',
      description: 'Generate high-quality hero frames for each video scene using Midjourney v6. These stills become the source material for video generation.',
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6',
      inputRequired: ['Video concept from Step 1', 'Brand visual references', 'Shot list'],
      outputProduced: ['4–6 hero stills per scene', '1× selected upscaled hero per scene'],
      estimatedMinutes: 40,
      estimatedCostUSD: 1.50,
      promptingGuidance: 'Generate each scene as a still first. Use --ar 9:16 for vertical video, 16:9 for landscape. Apply --style raw for maximum photorealism. Each still should be composed for the intended camera motion.',
      qualityRisks: ['Still composition must account for motion headroom', 'Character consistency across scenes requires --cref'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'AI Video Generation',
      description: 'Convert hero stills to cinematic video using Runway Gen-3 Alpha. Apply camera motion presets, Motion Brush for selective movement, and generate 5–10 second clips per scene.',
      toolId: 'runway-gen3',
      modelVariant: 'Gen-3 Alpha',
      inputRequired: ['Hero stills from Step 2', 'Motion direction brief', 'Camera movement specs'],
      outputProduced: ['5–10s video clips per scene', 'Multiple motion variants per hero still'],
      estimatedMinutes: 60,
      estimatedCostUSD: 5.00,
      promptingGuidance: 'Use image-to-video mode. Motion prompt: "slow dolly push, shallow depth of field, fabric catching light, editorial fashion film". Use Motion Brush to lock static elements. Generate 2–3 variants per still.',
      qualityRisks: ['Character face consistency across clips', 'Fabric physics may require multiple takes', 'Cut points need planning at still stage'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Video Assembly & Edit',
      description: 'Assemble clips in Adobe Express (short-form) or Premiere Pro. Add transitions, text overlays, brand elements, and music. Export platform-specific versions.',
      toolId: 'adobe-express',
      inputRequired: ['Video clips from Step 3', 'Copy overlays from Step 1', 'Brand music/audio'],
      outputProduced: ['15s TikTok/Reels version', '30s Hero video', '6s bumper ad', 'Still thumbnail set'],
      estimatedMinutes: 45,
      estimatedCostUSD: 0.20,
      qualityRisks: ['Clip transitions may expose motion inconsistencies', 'Audio sync requires careful attention'],
    },
    {
      id: generateId('step'),
      stepNumber: 5,
      title: 'Market Localisation & Approval',
      description: `Adapt text overlays and voiceover for ${req.markets.length} markets. Submit all versions for approval via Weavy.`,
      toolId: 'weavy',
      inputRequired: ['Assembled videos', 'Localised copy per market'],
      outputProduced: [`Approved localised videos ×${req.markets.length}`, 'Platform-ready exports'],
      estimatedMinutes: req.markets.length * 20,
      estimatedCostUSD: 0,
    },
  ];
}

function buildLocalizationWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Source Asset Audit & Market Brief',
      description: 'Analyse source campaign assets. Use ChatGPT 4o to generate market-specific adaptation briefs, cultural guidelines, and translation matrices for each target market.',
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Source campaign assets', 'Market cultural briefs', 'Translation requirements'],
      outputProduced: [`Adaptation brief ×${req.markets.length} markets`, 'Translation matrix', 'Cultural QA checklist'],
      estimatedMinutes: 30,
      estimatedCostUSD: 0.60,
      promptingGuidance: 'Prompt: "Analyse this fashion campaign for [brand] and identify elements requiring adaptation for [market]. Consider: cultural sensitivities, color symbolism, model diversity, copy tone, seasonal relevance. Output as structured adaptation checklist."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Visual Adaptation (Background & Context)',
      description: 'Use Adobe Firefly Generative Fill to adapt backgrounds and environmental context for each market. Maintain product and model while changing scene context.',
      toolId: 'adobe-firefly',
      modelVariant: 'Firefly Image 3',
      inputRequired: ['Source campaign images', 'Market environment references', 'Cultural visual brief'],
      outputProduced: [`Market-adapted hero images ×${req.markets.length}`, 'Seasonal variants per market'],
      estimatedMinutes: req.markets.length * 20,
      estimatedCostUSD: req.markets.length * 1.20,
      promptingGuidance: 'Select background/environment layer in Photoshop. Use Generative Fill with market-specific prompts: "Norwegian winter street, soft snow, Scandinavian architecture, golden hour" vs "Barcelona summer, Mediterranean architecture, warm afternoon light"',
      qualityRisks: ['Lighting consistency between product and new background', 'Shadow direction must match new environment'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'Copy Localisation & Text Adaptation',
      description: 'Translate and culturally adapt all text overlays, headlines, and CTAs. Apply localised typography rules within Adobe Express brand templates.',
      toolId: 'adobe-express',
      inputRequired: ['Adapted visuals', 'Translations from Step 1', 'Market-specific brand templates'],
      outputProduced: ['Fully localised asset set per market', 'All platform sizes per market'],
      estimatedMinutes: req.markets.length * 15,
      estimatedCostUSD: req.markets.length * 0.20,
      qualityRisks: ['Text length variation across languages (German/Norwegian text often longer)', 'Font support for special characters'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Market Review & Cultural QA',
      description: 'Route each market asset set to local brand managers via Weavy for cultural QA and final approval. Track feedback and revisions per market.',
      toolId: 'weavy',
      inputRequired: ['Localised asset sets', 'Cultural QA checklist from Step 1', 'Market approver contacts'],
      outputProduced: ['Approved localised assets per market', 'Revision log', 'Go-live confirmation per market'],
      estimatedMinutes: 120,
      estimatedCostUSD: 0,
      notes: 'Plan for 24–72h market review window. Use Weavy activity feeds to track approval status in real time.',
    },
  ];
}

function buildBatchVariationWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Prompt Engineering & Variation Matrix',
      description: 'Define variation parameters using ChatGPT 4o. Build a structured variation matrix covering style, color, mood, and setting dimensions.',
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Source image or brief', 'Variation dimensions required', 'Volume target'],
      outputProduced: ['Structured variation prompt library', 'Batch job specification', 'Naming convention guide'],
      estimatedMinutes: 20,
      estimatedCostUSD: 0.30,
      promptingGuidance: 'Prompt: "Create a variation matrix for [product/campaign] with [X] variables: [style variations], [color/mood], [setting]. Output as a structured prompt table ready for Midjourney/Firefly batch generation."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Batch Image Generation',
      description: 'Execute batch generation using Adobe Firefly API for brand-safe variations, and Midjourney for premium quality hero variants. Target: 20–50 raw images per batch.',
      toolId: 'adobe-firefly',
      modelVariant: 'Firefly Image 3 + API Batch',
      inputRequired: ['Prompt library from Step 1', 'Style references', 'Batch size target'],
      outputProduced: ['20–50 raw generated images', 'Batch generation log'],
      estimatedMinutes: 30,
      estimatedCostUSD: 2.50,
      promptingGuidance: 'Use Firefly API for programmatic batch generation. Structure prompts with variables: {style}, {color}, {setting}. Set seed values for controlled variation series.',
      qualityRisks: ['Variation consistency across batch', 'Some prompts may produce off-brand results requiring culling'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'Curation & QA',
      description: 'Curate batch output. Select top 20–30% of images. Apply Photoshop AI retouching to selected assets for production quality.',
      toolId: 'adobe-photoshop-ai',
      inputRequired: ['Raw batch images', 'Selection criteria brief'],
      outputProduced: ['Curated, retouched final set (typically 20–30% of batch)'],
      estimatedMinutes: 40,
      estimatedCostUSD: 1.00,
      qualityRisks: ['Success rate ~30–40% for hero-quality assets from batch', 'Higher volume needed than final output target'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Packaging & Delivery',
      description: 'Format and export final asset package via Adobe Express. Apply consistent metadata, naming, and deliver via Weavy for stakeholder review.',
      toolId: 'adobe-express',
      inputRequired: ['Curated images', 'Output format specs'],
      outputProduced: ['Final asset package', 'Approved delivery set'],
      estimatedMinutes: 20,
      estimatedCostUSD: 0.10,
    },
  ];
}

function buildProductStorytellingWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Narrative Strategy & Copy',
      description: `Develop product story narrative using ChatGPT 4o. Build emotional, benefit-led copy across the customer journey: awareness → consideration → purchase for ${req.brand}.`,
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Product information', 'Brand narrative guidelines', 'Customer personas', 'Markets'],
      outputProduced: ['Product narrative arc', 'Story-led copy per stage', 'Visual direction brief'],
      estimatedMinutes: 25,
      estimatedCostUSD: 0.40,
      promptingGuidance: 'Prompt: "You are a brand storyteller for [brand] at BESTSELLER. Create a product story narrative for [product] targeting [customer]. Include: origin story angle, key product features as emotional benefits, sensory descriptions of materials/construction, and CTA per funnel stage."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Editorial Hero Imagery',
      description: 'Generate cinematic, editorial-quality product story images using Midjourney v6. Focus on mood, context, and aspiration over pure product accuracy.',
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6',
      inputRequired: ['Narrative brief', 'Visual mood board', 'Product references'],
      outputProduced: ['6–8 editorial hero images', '2–3 detail/close-up images', '1 full-bleed campaign image'],
      estimatedMinutes: 45,
      estimatedCostUSD: 1.80,
      promptingGuidance: 'Prioritise mood and aspiration. Prompt: "[Emotional scene description], [product in context], [lighting and atmosphere], editorial fashion photography, shot on film, --ar 3:4 --style raw --sref [visual_reference]"',
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'Story Assembly (Lookbook/Carousel)',
      description: 'Arrange editorial images with narrative copy into lookbook, email template, or social carousel format using Adobe Express.',
      toolId: 'adobe-express',
      inputRequired: ['Editorial images', 'Narrative copy', 'Brand templates'],
      outputProduced: ['Digital lookbook PDF', 'Social media carousel set', 'Email campaign template', 'Web banner set'],
      estimatedMinutes: 35,
      estimatedCostUSD: 0.15,
      qualityRisks: ['Image sequence and narrative flow requires human creative direction'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Final QA & Brand Approval',
      description: 'Route completed storytelling assets through Weavy for brand manager sign-off. Ensure narrative, visual, and brand alignment.',
      toolId: 'weavy',
      inputRequired: ['Assembled story assets', 'Brand compliance checklist'],
      outputProduced: ['Approved storytelling asset package', 'Ready for publication'],
      estimatedMinutes: 45,
      estimatedCostUSD: 0,
    },
  ];
}

function buildEditorialCampaignWorkflow(req: AnalysisRequest): WorkflowStep[] {
  return [
    {
      id: generateId('step'),
      stepNumber: 1,
      title: 'Campaign Concept Development',
      description: `Define campaign concept, visual direction, and creative territories for ${req.brand}. Use ChatGPT 4o to develop multiple creative routes with rationale.`,
      toolId: 'chatgpt4o',
      modelVariant: 'GPT-4o',
      inputRequired: ['Campaign brief', 'Season/collection information', 'Brand positioning', 'Budget indication'],
      outputProduced: ['3 creative concept routes', 'Mood board direction per concept', 'Campaign taglines', 'Key visual descriptions'],
      estimatedMinutes: 30,
      estimatedCostUSD: 0.50,
      promptingGuidance: 'Prompt: "Develop 3 distinct creative concepts for [brand] [season] campaign. For each concept: name, core idea, visual language description, target emotion, key visual description (one hero shot), tagline options, and production complexity rating."',
    },
    {
      id: generateId('step'),
      stepNumber: 2,
      title: 'Concept Visualisation',
      description: 'Rapidly visualise all 3 creative concepts as AI-generated stills using Midjourney. Present to stakeholders for concept selection before full production.',
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6',
      inputRequired: ['Creative concept routes', 'Brand visual identity'],
      outputProduced: ['3–4 concept images per route (9–12 total)', 'Concept presentation deck content'],
      estimatedMinutes: 50,
      estimatedCostUSD: 2.50,
      promptingGuidance: 'Create one defining image per concept. Make them conceptually distinct. These are direction-setting, not final assets.',
      qualityRisks: ['AI visuals set expectations that full production must meet', 'Ensure concepts are achievable within production reality'],
    },
    {
      id: generateId('step'),
      stepNumber: 3,
      title: 'Approved Concept Production',
      description: 'Full production of approved campaign concept. Generate complete image suite: hero, supporting cast, product details, lifestyle. Use Adobe Stock for licensed supplement assets.',
      toolId: 'midjourney',
      modelVariant: 'Midjourney v6 (upscale + variations)',
      inputRequired: ['Approved concept brief', 'Production asset list', 'Market requirements'],
      outputProduced: ['10–20 hero campaign images', 'Product detail set', 'Full campaign image library'],
      estimatedMinutes: 120,
      estimatedCostUSD: 8.00,
      qualityRisks: ['Consistency across large image sets requires disciplined --sref and --cref usage', 'Art director QA essential'],
    },
    {
      id: generateId('step'),
      stepNumber: 4,
      title: 'Post-Production & Retouching',
      description: 'Professional AI-assisted retouching in Photoshop AI. Refine skin, correct product colors, enhance details, remove imperfections, and prepare files for all output channels.',
      toolId: 'adobe-photoshop-ai',
      inputRequired: ['Raw campaign images', 'Retouching brief', 'Color grade reference'],
      outputProduced: ['Retouched print-ready files', 'Web-optimised versions', 'Compressed social versions'],
      estimatedMinutes: 90,
      estimatedCostUSD: 3.00,
    },
    {
      id: generateId('step'),
      stepNumber: 5,
      title: 'Campaign Package & Localisation',
      description: `Adapt approved campaign assets for ${req.markets.length} markets using Adobe Express. Apply market-specific copy, formatting, and channel sizing.`,
      toolId: 'adobe-express',
      inputRequired: ['Retouched campaign images', 'Localised copy', 'Channel specifications'],
      outputProduced: [`Full campaign package ×${req.markets.length} markets`, 'All channel sizes', 'Digital delivery package'],
      estimatedMinutes: 60,
      estimatedCostUSD: 1.00,
    },
    {
      id: generateId('step'),
      stepNumber: 6,
      title: 'Final Approval & Distribution',
      description: 'Full campaign review and sign-off via Weavy. Brand directors and market leads approve. Track final asset delivery status.',
      toolId: 'weavy',
      inputRequired: ['Complete campaign package', 'Approval stakeholder list'],
      outputProduced: ['Campaign go-live approval', 'Final asset distribution package'],
      estimatedMinutes: 120,
      estimatedCostUSD: 0,
    },
  ];
}

function buildSteps(category: WorkflowCategory, req: AnalysisRequest): WorkflowStep[] {
  switch (category) {
    case 'social-campaign': return buildSocialCampaignWorkflow(req);
    case 'ecommerce-imagery': return buildEcomWorkflow(req);
    case 'video-concept': return buildVideoWorkflow(req);
    case 'market-localization': return buildLocalizationWorkflow(req);
    case 'batch-variation': return buildBatchVariationWorkflow(req);
    case 'product-storytelling': return buildProductStorytellingWorkflow(req);
    case 'editorial-campaign': return buildEditorialCampaignWorkflow(req);
    default: return buildEditorialCampaignWorkflow(req);
  }
}

function buildCostEstimate(steps: WorkflowStep[], req: AnalysisRequest): CostEstimate {
  const breakdown = steps.map(s => ({
    toolId: s.toolId,
    stepTitle: s.title,
    unitCost: s.estimatedCostUSD,
    units: 1,
    total: s.estimatedCostUSD,
  }));

  const baseTotal = breakdown.reduce((sum, b) => sum + b.total, 0);
  const marketMultiplier = Math.max(1, req.markets.filter(m => m !== 'Global').length);

  const low: CostEstimate['scenarioLow'] = {
    label: 'Low',
    volumeDescription: 'Single campaign, 1 market, minimal iterations',
    totalCost: parseFloat((baseTotal * 0.7).toFixed(2)),
    details: steps.map(s => ({ tool: s.toolId, cost: parseFloat((s.estimatedCostUSD * 0.7).toFixed(2)), units: 1, unitLabel: 'run' })),
  };

  const medium: CostEstimate['scenarioMedium'] = {
    label: 'Medium',
    volumeDescription: `Standard campaign, ${marketMultiplier} market(s), 2–3 revision rounds`,
    totalCost: parseFloat((baseTotal * marketMultiplier * 1.3).toFixed(2)),
    details: steps.map(s => ({ tool: s.toolId, cost: parseFloat((s.estimatedCostUSD * marketMultiplier * 1.3).toFixed(2)), units: marketMultiplier, unitLabel: 'market' })),
  };

  const high: CostEstimate['scenarioHigh'] = {
    label: 'High',
    volumeDescription: 'Full campaign suite, all markets, multiple concepts explored',
    totalCost: parseFloat((baseTotal * marketMultiplier * 2.8).toFixed(2)),
    details: steps.map(s => ({ tool: s.toolId, cost: parseFloat((s.estimatedCostUSD * marketMultiplier * 2.8).toFixed(2)), units: marketMultiplier * 2, unitLabel: 'market' })),
  };

  return {
    timestamp: new Date().toISOString(),
    currency: 'USD',
    scenarioLow: low,
    scenarioMedium: medium,
    scenarioHigh: high,
    perImage: 0.12,
    perVideo: 1.20,
    perCampaignBatch: medium.totalCost,
    perMarketAdaptation: parseFloat((baseTotal * 0.4).toFixed(2)),
    perFinalApprovedAsset: parseFloat((medium.totalCost / 15).toFixed(2)),
    assumptions: [
      'Pricing based on publicly available rates as of May 2025',
      'BESTSELLER assumed to hold Adobe Creative Cloud enterprise license',
      'Midjourney Pro plan ($60/user/month) assumed',
      'Success rate: ~70–90% of generated images usable after QA',
      `Market count: ${marketMultiplier} market(s) in scope`,
      'Does not include human creative time (art direction, QA, copywriting)',
      'Low scenario: minimal iteration; High scenario: full exploration with multiple concept routes',
    ],
    breakdown,
  };
}

function buildAlternativeRoutes(category: WorkflowCategory, baseCost: number, baseTime: number): AlternativeRoute[] {
  return [
    {
      name: 'Premium Quality Route',
      label: 'Best Quality',
      description: 'Maximum use of Midjourney v6 for all imagery, Runway Gen-3 for video, Photoshop AI for professional retouching. Full human art direction at every stage.',
      tools: ['midjourney', 'runway-gen3', 'adobe-photoshop-ai', 'chatgpt4o', 'weavy'],
      estimatedCost: parseFloat((baseCost * 1.8).toFixed(2)),
      estimatedTimeMinutes: Math.round(baseTime * 1.5),
      tradeoffs: 'Highest creative quality and fashion realism. Slower and more expensive. Requires skilled prompt engineers and art directors. Best for hero campaign assets and premium brand presentations.',
    },
    {
      name: 'Speed-Optimised Route',
      label: 'Fastest',
      description: 'Adobe Express + Firefly end-to-end. Template-driven, brand-consistent. Minimal iteration. DALL-E 3 for quick concept ideation. Ideal for time-sensitive social content.',
      tools: ['adobe-express', 'adobe-firefly', 'dalle3', 'chatgpt4o'],
      estimatedCost: parseFloat((baseCost * 0.6).toFixed(2)),
      estimatedTimeMinutes: Math.round(baseTime * 0.55),
      tradeoffs: 'Fastest time-to-delivery. Lower maximum quality ceiling. Template constraints limit full creative freedom. Best for always-on social content, tactical campaigns, and high-frequency publishing.',
    },
    {
      name: 'Cost-Efficient Route',
      label: 'Lowest Cost',
      description: 'Adobe Firefly (included in existing CC license) + Adobe Express. No additional tool subscriptions required. Suitable for standard campaigns with existing templates.',
      tools: ['adobe-firefly', 'adobe-express', 'chatgpt4o', 'weavy'],
      estimatedCost: parseFloat((baseCost * 0.35).toFixed(2)),
      estimatedTimeMinutes: Math.round(baseTime * 0.8),
      tradeoffs: 'Lowest incremental cost assuming existing Adobe CC enterprise license. Moderate quality. Best for budget-conscious campaigns, internal communications, and markets where premium quality is less critical.',
    },
  ];
}

function buildGovernanceNotes(category: WorkflowCategory, req: AnalysisRequest): string[] {
  const notes = [
    'All AI-generated assets must pass BESTSELLER brand compliance review before publication.',
    'Do not use AI-generated model faces that could be mistaken for real people without legal review.',
    'Adobe Firefly content is IP-indemnified and commercially safe. Midjourney requires Pro+ plan for commercial use.',
    'Human art direction and QA are mandatory for campaign-grade assets — AI handles generation, humans handle curation.',
  ];
  if (req.markets.includes('China')) {
    notes.push('China market: AI-generated imagery may require additional regulatory review under local advertising standards.');
  }
  if (category === 'video-concept') {
    notes.push('AI video: Ensure no real person\'s likeness is replicated without consent. Voiceover AI (ElevenLabs) requires talent consent protocols.');
  }
  if (req.assetTypes.includes('ecom')) {
    notes.push('E-commerce imagery: Product color accuracy must be validated against physical swatches before going live on PDP pages.');
  }
  return notes;
}

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  'social-campaign': 'Social Media Campaign',
  'ecommerce-imagery': 'E-Commerce Imagery',
  'video-concept': 'AI Video Production',
  'market-localization': 'Market Localisation',
  'editorial-campaign': 'Editorial Campaign',
  'batch-variation': 'Batch Image Variation',
  'product-storytelling': 'Product Storytelling',
};

export function analyzeWorkflow(req: AnalysisRequest): GeneratedWorkflow {
  const category = detectCategory(req.userInput);
  const steps = buildSteps(category, req);
  const totalTime = steps.reduce((sum, s) => sum + s.estimatedMinutes, 0);
  const totalCost = steps.reduce((sum, s) => sum + s.estimatedCostUSD, 0);
  const costEstimate = buildCostEstimate(steps, req);
  const alternatives = buildAlternativeRoutes(category, totalCost, totalTime);
  const governance = buildGovernanceNotes(category, req);

  const marketStr = req.markets.length > 1
    ? `across ${req.markets.slice(0, 3).join(', ')}${req.markets.length > 3 ? ` +${req.markets.length - 3} more` : ''}`
    : `for ${req.markets[0]}`;

  return {
    id: generateId('wf'),
    createdAt: new Date().toISOString(),
    userInput: req.userInput,
    brand: req.brand,
    markets: req.markets,
    assetTypes: req.assetTypes,
    complexity: req.complexity,
    workflowCategory: category,
    useCaseSummary: `${CATEGORY_LABELS[category]} workflow for ${req.brand} ${marketStr}. Complexity: ${req.complexity}. Asset types: ${req.assetTypes.join(', ')}.`,
    creativeObjective: `Deliver a high-quality, brand-consistent ${CATEGORY_LABELS[category].toLowerCase()} for ${req.brand} using approved BESTSELLER GenAI Media tools. Optimise for ${req.complexity === 'quick' ? 'speed and efficiency' : req.complexity === 'advanced' ? 'maximum quality and creative depth' : 'balanced quality and cost'}.`,
    recommendedRoute: `${steps.length}-step workflow combining ${[...new Set(steps.map(s => s.toolId))].slice(0, 3).join(', ')} — structured for ${req.complexity} complexity with ${req.markets.length} market(s) in scope.`,
    steps,
    totalEstimatedTimeMinutes: totalTime,
    costEstimate,
    qualityRisks: [
      'AI image consistency across a large asset suite requires disciplined style reference management.',
      'Final assets require human QA and art direction — AI accelerates but does not replace creative judgement.',
      'Brand color accuracy varies by model; Photoshop AI post-processing recommended for hero assets.',
      'Market-specific cultural nuances must be reviewed by local teams before publication.',
    ],
    governanceNotes: governance,
    finalRecommendation: `For ${req.brand} ${CATEGORY_LABELS[category].toLowerCase()} at ${req.complexity} complexity: use the recommended ${steps.length}-step workflow. Start with ChatGPT 4o for strategy and prompting, ${category === 'video-concept' ? 'Midjourney for stills + Runway Gen-3 for motion' : category === 'ecommerce-imagery' ? 'Firefly for brand-safe batch production + Midjourney for hero shots' : 'Midjourney for premium imagery + Firefly for brand-safe production'}. Route all assets through Weavy for governed approval. Estimated total investment: $${costEstimate.scenarioMedium.totalCost} for a standard run at ${req.markets.length} market(s). ${format(new Date(), 'PPP')} pricing.`,
    alternativeRoutes: alternatives,
  };
}
