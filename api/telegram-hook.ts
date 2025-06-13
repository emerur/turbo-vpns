import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Replace with your bot token
const SECRET_HASH = "32e58fbahey833349df338gjhdvc910e1822"; // Replace with your own secret hash

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// get webhook information
// GET https://api.telegram.org/bot{my_bot_token}/getWebhookInfo

//api.telegram.org/bot{token}/setWebhook?url={url}/api/telegram-hook?secret_hash={secret_hash}

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const channelUrl = "t.me/limitless119";

  // Welcome message with Markdown formatting
  const reply = `
📊 *Wealth Plan - Crypto Indicators*

Unlock access to free TradingView-compatible tools that help you:
- Time your crypto entries & exits
- Monitor key trading signals
- Learn practical crypto strategies

What would you like to do?
`;

  try {
    await ctx.reply(reply, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard:[
      [
        { text: "📈 View Indicator Info", callback_data: "view_info" },
        { text: "❓ How It Works", callback_data: "how_it_works" },
      ],
      [
        { text: "🔗 Join Channel", url: "https://t.me/limitless119" }
      ]
    ]
      },
    });
    console.log(`Reply to ${COMMAND} command sent successfully.`);
  } catch (error) {
    console.error(`Something went wrong with the ${COMMAND} command:`, error);
  }
}

// Register the /start command handler
bot.command("start", async (ctx) => {
  await handleStartCommand(ctx);
});
bot.command("help", (ctx) => {
  ctx.reply("Use this bot to learn about free crypto indicators, how to use them, and access our trading community.");
});

bot.action("view_info", async (ctx) => {
  await ctx.answerCbQuery(); // remove "loading..."
  await ctx.reply("This free indicator works with all major crypto pairs. Use it on TradingView to identify trends and entry/exit points.");
});

bot.action("how_it_works", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("We use proven indicators based on volume and trend behavior. No hype — just tools to help you analyze with confidence.");
});


// API route handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    // Set webhook if requested
    if (query.setWebhook === "true") {
      const webhookUrl = `${baseUrl}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    // Handle incoming updates from Telegram
    if (query.secret_hash == SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Error handling Telegram update:", error.toString());
  }

  // Acknowledge the request with Telegram
  res.status(200).send("OK");
};
