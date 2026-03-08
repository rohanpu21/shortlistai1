

## Plan: Integrate Sarvam-105B Model for Resume Analysis

### What Changes

Both edge functions (`analyze-resume` and `rewrite-resume`) currently call the Lovable AI Gateway with `openai/gpt-5`. We'll switch them to call the **Sarvam AI API** (`https://api.sarvam.ai/v1/chat/completions`) with model `sarvam-105b`.

### Architecture

The Sarvam API is OpenAI-compatible, so the change is minimal:

1. **Add secret**: Store your Sarvam API key as `SARVAM_API_KEY` in the backend secrets
2. **Update `supabase/functions/analyze-resume/index.ts`**:
   - Replace the fetch URL from `https://ai.gateway.lovable.dev/v1/chat/completions` → `https://api.sarvam.ai/v1/chat/completions`
   - Replace auth header from `Bearer ${LOVABLE_API_KEY}` → `Bearer ${SARVAM_API_KEY}`
   - Replace model from `openai/gpt-5` → `sarvam-105b`
3. **Update `supabase/functions/rewrite-resume/index.ts`**: Same three changes as above

### What Stays the Same

- All text extraction logic (unpdf, JSZip) remains unchanged
- System/user prompts remain unchanged
- Frontend code remains unchanged
- Error handling for 429/402 remains

### Steps

1. Add `SARVAM_API_KEY` secret
2. Update both edge functions (3-line change each)
3. Test end-to-end

