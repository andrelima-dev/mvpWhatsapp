const fs = require('fs');
const path = require('path');

// Mapeamento de imports corrompidos para corretos
const importMappings = {
  // Root-level imports (app.module.ts)
  "import configuration from ''": "import configuration from './config/configuration'",
  "import validationSchema from ''": "import validationSchema from './config/validation'",
  "import { PrismaModule } from ''": "import { PrismaModule } from './infrastructure/prisma/prisma.module'",
  "import { AuthModule } from ''": "import { AuthModule } from './modules/auth/auth.module'",
  "import { UsersModule } from ''": "import { UsersModule } from './modules/users/users.module'",
  "import { ClientsModule } from ''": "import { ClientsModule } from './modules/clients/clients.module'",
  "import { ConversationsModule } from ''": "import { ConversationsModule } from './modules/conversations/conversations.module'",
  "import { WhatsappModule } from ''": "import { WhatsappModule } from './modules/whatsapp/whatsapp.module'",
  "import { MessagesModule } from ''": "import { MessagesModule } from './modules/messages/messages.module'",
  "import { AssignmentsModule } from ''": "import { AssignmentsModule } from './modules/assignments/assignments.module'",
  
  // Wrong relative paths for modules
  "import { UsersModule } from './modules/users/users.module'": "import { UsersModule } from '../users/users.module'",
  "import { PrismaModule } from './infrastructure/prisma/prisma.module'": "import { PrismaModule } from '../../infrastructure/prisma/prisma.module'",
  "import { MessagesModule } from './modules/messages/messages.module'": "import { MessagesModule } from '../messages/messages.module'",
  "import { AssignmentsModule } from './modules/assignments/assignments.module'": "import { AssignmentsModule } from '../assignments/assignments.module'",
  "import { ConversationsModule } from './modules/conversations/conversations.module'": "import { ConversationsModule } from '../conversations/conversations.module'",
  
  // Prisma
  "import { PrismaService } from ''": "import { PrismaService } from '../../infrastructure/prisma/prisma.service'",
  
  // Cross-module Services (fix for whatsapp/conversations/messages)
  "import { ConversationsService } from './conversations.service'": "import { ConversationsService } from '../conversations/conversations.service'",
  "import { MessagesService } from './messages.service'": "import { MessagesService } from '../messages/messages.service'",
  "import { UsersService } from './users.service'": "import { UsersService } from '../users/users.service'",
  
  // Local Services/Controllers/Gateways (same directory)
  "import { UsersController } from ''": "import { UsersController } from './users.controller'",
  "import { ClientsService } from ''": "import { ClientsService } from './clients.service'",
  "import { ClientsController } from ''": "import { ClientsController } from './clients.controller'",
  "import { ConversationsController } from ''": "import { ConversationsController } from './conversations.controller'",
  "import { ConversationsGateway } from ''": "import { ConversationsGateway } from './conversations.gateway'",
  "import { MessagesController } from ''": "import { MessagesController } from './messages.controller'",
  "import { AssignmentsService } from ''": "import { AssignmentsService } from './assignments.service'",
  "import { WhatsappService } from ''": "import { WhatsappService } from './whatsapp.service'",
  "import { WhatsappController } from ''": "import { WhatsappController } from './whatsapp.controller'",
  "import { AuthService } from ''": "import { AuthService } from './auth.service'",
  "import { AuthController } from ''": "import { AuthController } from './auth.controller'",
  "import { TokensService } from ''": "import { TokensService } from './tokens.service'",
  
  // DTOs - wrong paths
  "import { CreateClientDto } from './dto/create-client.dto'": "import { CreateClientDto } from './create-client.dto'",
  "import { CreateUserDto } from './dto/create-user.dto'": "import { CreateUserDto } from './create-user.dto'",
  "import { LoginDto } from './dto/login.dto'": "import { LoginDto } from './login.dto'",
  
  // DTOs - empty imports
  "import { CreateUserDto } from ''": "import { CreateUserDto } from './dto/create-user.dto'",
  "import { UpdateUserDto } from ''": "import { UpdateUserDto } from './dto/update-user.dto'",
  "import { CreateClientDto } from ''": "import { CreateClientDto } from './dto/create-client.dto'",
  "import { UpdateClientDto } from ''": "import { UpdateClientDto } from './dto/update-client.dto'",
  "import { CreateMessageDto } from ''": "import { CreateMessageDto } from './dto/create-message.dto'",
  "import { LoginDto } from ''": "import { LoginDto } from './dto/login.dto'",
  "import { RegisterDto } from ''": "import { RegisterDto } from './dto/register.dto'",
  "import { RefreshTokenDto } from ''": "import { RefreshTokenDto } from './dto/refresh-token.dto'",
  
  // Strategies
  "import { JwtStrategy } from ''": "import { JwtStrategy } from './strategies/jwt.strategy'",
  "import { RefreshStrategy } from ''": "import { RefreshStrategy } from './strategies/refresh.strategy'",
  "import { RefreshTokenStrategy } from ''": "import { RefreshTokenStrategy } from './strategies/refresh.strategy'",
  
  // Guards/Decorators
  "import { JwtAuthGuard } from ''": "import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'",
  "import { RolesGuard } from ''": "import { RolesGuard } from '../../common/guards/roles.guard'",
  "import { Roles } from ''": "import { Roles } from '../../common/decorators/roles.decorator'",
  "import { ROLES_KEY } from ''": "import { ROLES_KEY } from '../decorators/roles.decorator'",
  "import { User } from ''": "import { User } from '../../common/decorators/user.decorator'",
  
  // Main.ts
  "import { AppModule } from ''": "import { AppModule } from './app.module'",
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [corrupted, correct] of Object.entries(importMappings)) {
    if (content.includes(corrupted)) {
      content = content.replace(new RegExp(corrupted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
      modified = true;
    }
  }
  
  // Fix index.ts exports
  if (path.basename(filePath) === 'index.ts') {
    const moduleName = path.basename(path.dirname(filePath));
    content = content.replace(/export \* from ''/g, `export * from './${moduleName}'`);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath);
    } else if (file.endsWith('.ts')) {
      if (fixFile(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('Restaurando imports corrompidos...\n');
const fixedCount = walkDir(path.join(__dirname, 'src'));
console.log(`\n✓ ${fixedCount} arquivos restaurados!`);
