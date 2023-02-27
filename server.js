const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("5936990208:AAENsKqUUIs5iYyH8SgDCiRn-V1bzV2dc44", {
  polling: true,
});

// Функция для отправки HTTP-запроса к заданному URL-адресу
const sendHttpRequest = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// Функция для отправки HTTP-запроса по расписанию
const scheduleHttpRequest = (url, hour, minute) => {
  const interval = 24 * 60 * 60 * 1000; // один день
  const targetTime = new Date();
  targetTime.setHours(hour);
  targetTime.setMinutes(minute);

  const timeUntilTarget = targetTime.getTime() - Date.now();
  const timeout =
    timeUntilTarget > 0 ? timeUntilTarget : interval + timeUntilTarget;

  setTimeout(() => {
    sendHttpRequest(url);
    setInterval(() => {
      sendHttpRequest(url);
    }, interval);
  }, timeout);
};

// Создаем inline клавиатуру
const inlineKeyboard = {
  inline_keyboard: [
    [
      {
        text: "Sync Y_CV",
        callback_data: "sync_cv",
      },
      {
        text: "Sync Y_LV",
        callback_data: "sync_lv",
      },
      {
        text: "Sync Y_IF",
        callback_data: "sync_if",
      },
    ],
  ],
};

// Отправляем HTTP-запрос по нажатию на кнопку
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const callbackData = callbackQuery.data;

  switch (callbackData) {
    case "sync_cv":
      const cvUrl =
        "https://yoki.ua/wp-content/themes/yoki/functions/iiko_sync_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Синхронізація Y_CV розпочалась",
      });
      sendHttpRequest(cvUrl)
        .then(() =>
          bot.editMessageText("Y_CV synchronized successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to synchronize Y_CV", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;
    case "sync_lv":
      const lvUrl =
        "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_sync_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Синхронізація Y_LV розпочалась",
      });
      sendHttpRequest(lvUrl)
        .then(() =>
          bot.editMessageText("Y_LV synchronized successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to synchronize Y_LV", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;
      case "sync_if":
      const ifUrl =
        "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_sync_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Синхронізація Y_IF розпочалась",
      });
      sendHttpRequest(ifUrl)
        .then(() =>
          bot.editMessageText("Y_IF synchronized successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to synchronize Y_IF", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;

      case "import_cv":
      const importcvUrl =
        "https://yoki.ua/wp-content/themes/yoki/functions/iiko_import_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Імпорт Y_CV розпачався",
      });
      sendHttpRequest(importcvUrl)
        .then(() =>
          bot.editMessageText("Y_CV imported successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to import Y_CV", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;
    case "import_lv":
      const importlvUrl =
        "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_import_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Імпорт Y_LV розпочався",
      });
      sendHttpRequest(importlvUrl)
        .then(() =>
          bot.editMessageText("Y_LV imported successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to import Y_LV", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;
      case "import_if":
      const importifUrl =
        "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_import_products.php";
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Імпорт Y_IF розпочався",
      });
      sendHttpRequest(importifUrl)
        .then(() =>
          bot.editMessageText("Y_IF imported successfully", {
            chat_id: chatId,
            message_id: messageId,
          })
        )
        .catch(() =>
          bot.editMessageText("Failed to import Y_IF", {
            chat_id: chatId,
            message_id: messageId,
          })
        );
      break;
    default:
      break;
  }
});

// Отправляем inline клавиатуру и настраиваем кнопки на ее использование
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "(НАТИСКАЄ, ТІЛЬКИ ТОЙ ХТО ВИКЛИКАВ БОТА) Виберіть, яке Yoki синхронізувати:",
    { reply_markup: inlineKeyboard }
  );
});

// Отправляем HTTP запрос
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "Sync Y_CV") {
    const cvUrl =
      "https://yoki.ua/wp-content/themes/yoki/functions/iiko_sync_products.php";
    bot.sendMessage(chatId, "Синхронізація Y_CV розпочалась");
    sendHttpRequest(cvUrl)
      .then(() => bot.sendMessage(chatId, "Y_CV synchronized successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to synchronize Y_CV"));
  } else if (msg.text === "Sync Y_LV") {
    const lvUrl =
      "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_sync_products.php";
    bot.sendMessage(chatId, "Синхронізація Y_LV розпочалась");
    sendHttpRequest(lvUrl)
      .then(() => bot.sendMessage(chatId, "Y_LV synchronized successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to synchronize Y_LV"));
  }
  else if (msg.text === "Sync Y_IF") {
    const ifUrl =
      "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_sync_products.php";
    bot.sendMessage(chatId, "Синхронізація Y_LV розпочалась");
    sendHttpRequest(ifUrl)
      .then(() => bot.sendMessage(chatId, "Y_IF synchronized successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to synchronize Y_IF"));
  }

  else if (msg.text === "Import Y_CV") {
    const importcvUrl =
      "https://yoki.ua/wp-content/themes/yoki/functions/iiko_import_products.php";
    bot.sendMessage(chatId, "Імпорт Y_CV розпочався");
    sendHttpRequest(importcvUrl)
      .then(() => bot.sendMessage(chatId, "Y_CV imported successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to import Y_CV"));
  } else if (msg.text === "Import Y_LV") {
    const importlvUrl =
      "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_import_products.php";
    bot.sendMessage(chatId, "Імпорт Y_LV розпочався");
    sendHttpRequest(importlvUrl)
      .then(() => bot.sendMessage(chatId, "Y_LV imported successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to import Y_LV"));
  }
  else if (msg.text === "Import Y_IF") {
    const importifUrl =
      "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_import_products.php";
    bot.sendMessage(chatId, "Імпорт Y_LV розпочався");
    sendHttpRequest(importifUrl)
      .then(() => bot.sendMessage(chatId, "Y_IF imported successfully"))
      .catch(() => bot.sendMessage(chatId, "Failed to import Y_IF"));
  }
});

// Настраиваем отправку HTTP-запросов по расписанию
scheduleHttpRequest(
  "https://yoki.ua/wp-content/themes/yoki/functions/iiko_import_products.php",
  07,
  00
);
scheduleHttpRequest(
  "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_import_products.php",
  07,
  05
);
scheduleHttpRequest(
  "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_import_products.php",
  07,
  10
);
scheduleHttpRequest(
  "https://yoki.ua/wp-content/themes/yoki/functions/iiko_sync_products.php",
  07,
  15
);
scheduleHttpRequest(
  "https://yoki.ua/lviv/wp-content/themes/yoki/functions/iiko_sync_products.php",
  07,
  20
);
scheduleHttpRequest(
  "https://yoki.ua/if/wp-content/themes/yoki/functions/iiko_sync_products.php",
  07,
  25
);
