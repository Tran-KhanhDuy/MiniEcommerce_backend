"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageValue = void 0;
const en_json_1 = __importDefault(require("../../common/lang/en.json"));
const vi_json_1 = __importDefault(require("../../common/lang/vi.json"));
const getLanguageValue = (language = 'vi', key, params) => {
    const languageSource = language === 'vi' ? vi_json_1.default : en_json_1.default;
    let message = languageSource[key] ?? key;
    if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
            const regex = new RegExp(`{${paramKey}}`, 'g');
            message = message.replace(regex, String(paramValue));
        });
    }
    return message;
};
exports.getLanguageValue = getLanguageValue;
//# sourceMappingURL=language.helper.js.map