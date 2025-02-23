"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
const fs = __importStar(require("fs"));
class MemoryManager {
    constructor() {
        this.todoPath = 'todo.md';
    }
    saveProgress(flow) {
        const timestamp = new Date().toISOString();
        const progress = `
[${timestamp}] Прогресс обсуждения
Текущая шляпа: ${flow.currentHat}
Количество собранных мнений: ${flow.insights.length}
Следующий шаг: ${this.getNextStep(flow)}
`;
        fs.appendFileSync(this.todoPath, progress);
    }
    saveError(error) {
        const timestamp = new Date().toISOString();
        const errorLog = `
[${timestamp}] Произошла ошибка
${error.message}
Стек: ${error.stack}
`;
        fs.appendFileSync(this.todoPath, errorLog);
    }
    getNextStep(flow) {
        const hats = ['white', 'red', 'black', 'yellow', 'green', 'blue'];
        const currentIndex = hats.indexOf(flow.currentHat);
        return currentIndex < hats.length - 1 ?
            `Переход к ${hats[currentIndex + 1]} шляпе` :
            'Формирование итогового решения';
    }
}
exports.MemoryManager = MemoryManager;
