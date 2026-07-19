# Prompts Log - AI Concierge Integration

This log details the system instructions, prompt variations, and token parameters tested during the development of the Kumaon Craft Connect AI Assistant.

---

## 1. System Prompt & Persona Roles Used
For all variations, we defined the assistant role as a **Kumaon Craft Connect AI Concierge** with the following primary guidelines:
*   **Persona**: Friendly Kumaoni guide representing local artisan guilds (weavers, coppersmiths, Aipan painters).
*   **Domain Knowledge**: Traditional craft logistics, lead times, order inquiry processes, and dashboard navigation.
*   **Constraints**: Secure, direct, and matching the custom e-commerce interface.

---

## 2. Prompt Variations Tested

### Variation 1: Context Prefixed in User Message (Legacy Prepending)
*   **Configuration**: The system instructions were prepended directly inside the user's message body string (e.g. `[System Context]\n\nUser Question: [Message]`).
*   **Test Input**: `"hello"`
*   **Test Output**:
    ```text
    tags, or markdown bullets):**
    ```
*   **Analysis**: This method failed. Prepending system instructions directly to the user input confused the LLM. Rather than answering the greeting, it attempted to complete the formatting rules specified at the end of the instructions block.

---

### Variation 2: Separated System Field with Low Token Budget (300 Max)
*   **Configuration**: Separated system context into the API's root-level `systemInstruction` field, but kept `maxOutputTokens: 300` in the generation config.
*   **Test Input**: `"how can i order almora copperware"`
*   **Test Output**:
    ```text
    Almora copperware, locally known as Tam
    ```
*   **Analysis**: This variation resulted in truncated outputs. Because the Gemini 3.5 reasoning model consumes output tokens for its internal thought/thinking process first, a 300 token budget was depleted by thoughts (286 tokens), leaving only 14 tokens for the actual text response.

---

### Variation 3: Separate System Prompt, Large Token Budget & Concise Constraints (Final Winner)
*   **Configuration**: Passed context in `systemInstruction`, increased `maxOutputTokens` to `2048` to allow room for reasoning thoughts, and explicitly commanded: *"Keep responses extremely concise and to-the-point (under 2-3 sentences max). Do not use introductory fluff or wordy explanations."*
*   **Test Input**: `"how can i order almora copperware"`
*   **Test Output**:
    ```text
    Namaste! To order handcrafted Almora copperware, log into your Buyer Dashboard, select your items from the catalog, specify the quantity, and click 'Submit Inquiry' to receive a custom quote. Since these are hand-beaten by Tamta artisans, please allow 7-10 days for crafting if items are out of stock.
    ```
*   **Analysis**: This prompt worked perfectly. It allowed the reasoning model to think fully without cutting off the final response text, while successfully keeping the user-facing answers concise, polite, and directly relevant to the e-commerce context.

---

## 3. Comparative Evaluation
**Variation 3** worked best because it properly separated the system instruction from the dialogue content, resolving the autocomplete loop bug. By increasing the `maxOutputTokens` limit to `2048` and adding strict length rules (2-3 sentences) inside the system instructions, it successfully allocated token headroom for reasoning processes while keeping the user-facing message body concise. This resulted in zero text truncation and highly professional replies.
