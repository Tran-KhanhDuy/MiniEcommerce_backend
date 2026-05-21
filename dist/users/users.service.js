"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const bcryptjs_1 = require("bcryptjs");
const language_helper_1 = require("../common/helpers/language.helper");
const users_model_1 = require("./users.model");
let UsersService = class UsersService {
    usersModel;
    jwtService;
    constructor(usersModel, jwtService) {
        this.usersModel = usersModel;
        this.jwtService = jwtService;
    }
    generateJWTToken(user) {
        const payload = {
            id: user.id,
            code: user.code,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    async login(loginDto, language = 'vi') {
        const user = await this.usersModel.findOne({
            where: {
                code: loginDto.code,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException((0, language_helper_1.getLanguageValue)(language, 'login_failed'));
        }
        if (!user.canLogin) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'account_locked'));
        }
        if (!user.password) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'account_is_not_registered'));
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException((0, language_helper_1.getLanguageValue)(language, 'invalid_password'));
        }
        const accessToken = this.generateJWTToken(user);
        return {
            accessToken,
            user: {
                id: user.id,
                code: user.code,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(users_model_1.Users)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map