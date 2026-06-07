const axios = require("axios");

const categorizeExpense = async (description) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are a finance AI assistant. Return ONLY valid JSON.",
          },
          {
            role: "user",
            content: `
Categorize this expense:

"${description}"

Return ONLY JSON.

Example:

{
  "category":"Food & Dining",
  "confidence":0.95,
  "insight":"Restaurant spending detected"
}

Allowed Categories:

Food & Dining
Transportation
Shopping
Healthcare
Subscriptions
Entertainment
Education
Investment
Bills
Other
`,
          },
        ],

        temperature: 0.2,
        max_tokens: 200,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text =
      response.data.choices[0].message.content;

    console.log("AI RESPONSE:");
    console.log(text);

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (
      firstBrace !== -1 &&
      lastBrace !== -1
    ) {
      text = text.substring(
        firstBrace,
        lastBrace + 1
      );
    }

    const parsed = JSON.parse(text);

    return {
      category:
        parsed.category || "Other",

      confidence:
        parsed.confidence || 0.8,

      insight:
        parsed.insight ||
        "Expense categorized successfully",
    };
  } catch (error) {
    console.log(
      "AI Categorization Error:"
    );

    if (error.response) {
      console.log(
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );
    } else {
      console.log(error.message);
    }

    return {
      category: "Other",
      confidence: 0,
      insight:
        "Unable to categorize expense",
    };
  }
};

module.exports = {
  categorizeExpense,
};