// @ts-nocheck

import { generateProjectIdeas } from "./ai/flows/generate-project-ideas";
import { logger } from "firebase-functions/v2";
import { generateProjectPlan } from "./ai/flows/generate-project-plan";
import { suggestTaskHints } from "./ai/flows/suggest-task-hints";
import { generateCurriculumSuggestions } from "./ai/flows/generate-curriculum-suggestions";

// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");

// Define the API key parameter
const anthropicApiKey = defineString("ANTHROPIC_API_KEY");

exports.claudeChat = onRequest({ cors: true }, async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image, imageType } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    // Get the API key from environment variable
    const ANTHROPIC_API_KEY = anthropicApiKey.value();

    if (!ANTHROPIC_API_KEY) {
      console.error("Anthropic API key not configured");
      return res.status(500).json({ error: "API key not configured" });
    }

    let requestBody = {
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2000,
      messages: [],
    };

    // Handle image + text or text only
    if (image) {
      // For image analysis, create a message with both image and text
      const content = [];

      // Add image to content
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: imageType || "image/jpeg",
          data: image,
        },
      });

      // Add text prompt for attendance analysis
      content.push({
        type: "text",
        text:
          message ||
          `Please analyze this attendance register image and extract the structured data. Return the data in JSON format with the following structure:
        {
          "employees": [
            {
              "name": "Employee Name",
              "attendance": {
                "1": "P/A/S", // Day 1 status
                "2": "P/A/S", // Day 2 status
                // ... for all days shown
              }
            }
          ],
          "legend": {
            "P": "Present",
            "A": "Absent",
            "S": "Sick/Leave"
          }
        }

        Extract all employee names and their daily attendance status. Use 'P' for Present, 'A' for Absent, and 'S' for Sick/Leave or other special codes.`,
      });

      requestBody.messages.push({
        role: "user",
        content: content,
      });
    } else {
      // Text only message
      requestBody.messages.push({
        role: "user",
        content: message,
      });
    }

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API error:", errorData);
      return res
        .status(500)
        .json({ error: "Failed to get response from Claude" });
    }

    const data = await response.json();

    // Extract the response text from Claude's response
    const claudeResponse = data.content[0].text;

    return res.status(200).json({
      response: claudeResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.generateProjectIdeasFn = onRequest({ cors: true }, async (req, res) => {
  try {
    const response = await generateProjectIdeas(req.body);
    logger.info("inside generateProjectIdeasFn response ", response);

    return res.status(200).json({
      response: response,
    });

    return;
  } catch (error) {
    return {
      error: "Firebase error",
    };
  }
});

exports.generateProjectPlanFn = onRequest({ cors: true }, async (req, res) => {
  try {
    const response = await generateProjectPlan(req.body);
    logger.info("inside generateProjectPlanFn response ", response);

    return res.status(200).json({
      response: response,
    });

    return;
  } catch (error) {
    return {
      error: "Firebase error",
    };
  }
});

exports.suggestTaskHintsFn = onRequest({ cors: true }, async (req, res) => {
  try {
    const response = await suggestTaskHints(req.body);
    logger.info("inside suggestTaskHints response ", response);

    return res.status(200).json({
      response: response,
    });

    return;
  } catch (error) {
    return {
      error: "Firebase error",
    };
  }
});

exports.generateCurriculumSuggestionsFn = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const response = await generateCurriculumSuggestions(req.body);
      logger.info("inside generateCurriculumSuggestionsFn response ", response);

      return res.status(200).json({
        response: response,
      });

      return;
    } catch (error) {
      return {
        error: "Firebase error",
      };
    }
  }
);

export { sendGmailEmail } from './gmailSend';
export { startGmailAuth, oauth2callback } from './gmailAuth';
export { checkIncomingEmails } from './emailListener';
export { parsePdfForEmail } from './pdfParser';
export { processEmailWithAI } from './ai/emailProcessor';
