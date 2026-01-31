import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Replace with your bot toke
///api.telegram.org/bot{token}/setWebhook?url={url}/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180
//api.telegram.org/bot{token}setWebhook?url=https://mobile-proxies.vercel.app/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180

const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const channelUrl = "t.me/cleantower";
  const targetUrl = "t.me/+B0tKNYO8eDU5ZDYx";

  // Welcome message with Markdown formatting
  const reply = `
Discover Proven Wealth-Building Strategies!

Tired of being duped by get-rich-quick scams? Your search ends here! We're granting you complimentary access to genuine, effective methods for generating income. No prior experience required – our comprehensive guides will walk you through every step of the process.

Inside, you'll uncover:

• Verified techniques for Bank Logs, Cash App, and Credit Cards
• Unemployment Benefits insights
• Transfers Walkthroughs & Guidance
• Flips & Clones

Do not share methods from this channel

🔗 [Join Here](${targetUrl})
`;

  try {
    await ctx.reply(reply, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Join Proxies & VPNs Channel",
              url: channelUrl,
            },
          ]
        ],
      },
    });
    console.log(`Reply to ${COMMAND} command sent successfully.`);
  } catch (error) {
    console.error(`Something went wrong with the ${COMMAND} command:`, error);
  }
}
export async function sendImageCommand(ctx) {
  const media = [
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/turbo-vpns/main/WhatsApp%20Image%202025-08-11%20at%2016.26.56_56067a86.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/turbo-vpns/main/WhatsApp%20Image%202025-08-11%20at%2016.26.56_ed46fc6f.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/turbo-vpns/main/WhatsApp%20Image%202025-08-11%20at%2016.28.30_127bea52.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/turbo-vpns/main/WhatsApp%20Image%202025-08-11%20at%2016.28.31_ec9519c0.jpg",
    },
    
  ];
  // Send image first
  await ctx.replyWithMediaGroup(media);
}

// Register the /start command handler
bot.command("start", async (ctx) => {
  // Send image first
  await sendImageCommand(ctx);
  await handleStartCommand(ctx);
});

// Webhook handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.WEBHOOK_URL}`;
      const success = await bot.telegram.setWebhook(webhookUrl);
      // console.log("Webchook set:", webhookUrl, success);
      return res.status(200).send("OK");
    }

    await bot.handleUpdate(body);
    return res.status(200).send("OK");
  } catch (err) {
    return res.json({ error: "Internal server error" }, { status: 500 });
  }

  // res.status(200).send("OK");
};
