Write-Host "Restaurando imports corrompidos..." -ForegroundColor Green

$files = Get-ChildItem -Path "src" -Recurse -Filter *.ts

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Config
    $content = $content -replace "import configuration from ''", "import configuration from './config/configuration'"
    $content = $content -replace "import validationSchema from ''", "import validationSchema from './config/validation'"
    
    # Infrastructure
    $content = $content -replace "import \{ PrismaModule \} from ''", "import { PrismaModule } from './infrastructure/prisma/prisma.module'"
    $content = $content -replace "import \{ PrismaService \} from ''", "import { PrismaService } from '../../infrastructure/prisma/prisma.service'"
    
    # Modules in app.module.ts
    $content = $content -replace "import \{ AuthModule \} from ''", "import { AuthModule } from './modules/auth/auth.module'"
    $content = $content -replace "import \{ UsersModule \} from ''", "import { UsersModule } from './modules/users/users.module'"
    $content = $content -replace "import \{ ClientsModule \} from ''", "import { ClientsModule } from './modules/clients/clients.module'"
    $content = $content -replace "import \{ ConversationsModule \} from ''", "import { ConversationsModule } from './modules/conversations/conversations.module'"
    $content = $content -replace "import \{ WhatsappModule \} from ''", "import { WhatsappModule } from './modules/whatsapp/whatsapp.module'"
    $content = $content -replace "import \{ MessagesModule \} from ''", "import { MessagesModule } from './modules/messages/messages.module'"
    $content = $content -replace "import \{ AssignmentsModule \} from ''", "import { AssignmentsModule } from './modules/assignments/assignments.module'"
    
    # Services/Controllers/Gateways (local)
    $content = $content -replace "import \{ UsersService \} from ''", "import { UsersService } from './users.service'"
    $content = $content -replace "import \{ UsersController \} from ''", "import { UsersController } from './users.controller'"
    $content = $content -replace "import \{ ClientsService \} from ''", "import { ClientsService } from './clients.service'"
    $content = $content -replace "import \{ ClientsController \} from ''", "import { ClientsController } from './clients.controller'"
    $content = $content -replace "import \{ ConversationsService \} from ''", "import { ConversationsService } from './conversations.service'"
    $content = $content -replace "import \{ ConversationsController \} from ''", "import { ConversationsController } from './conversations.controller'"
    $content = $content -replace "import \{ ConversationsGateway \} from ''", "import { ConversationsGateway } from './conversations.gateway'"
    $content = $content -replace "import \{ MessagesService \} from ''", "import { MessagesService } from './messages.service'"
    $content = $content -replace "import \{ MessagesController \} from ''", "import { MessagesController } from './messages.controller'"
    $content = $content -replace "import \{ AssignmentsService \} from ''", "import { AssignmentsService } from './assignments.service'"
    $content = $content -replace "import \{ WhatsappService \} from ''", "import { WhatsappService } from './whatsapp.service'"
    $content = $content -replace "import \{ WhatsappController \} from ''", "import { WhatsappController } from './whatsapp.controller'"
    $content = $content -replace "import \{ AuthService \} from ''", "import { AuthService } from './auth.service'"
    $content = $content -replace "import \{ TokensService \} from ''", "import { TokensService } from './tokens.service'"
    
    # DTOs
    $content = $content -replace "import \{ CreateUserDto \} from ''", "import { CreateUserDto } from './dto/create-user.dto'"
    $content = $content -replace "import \{ UpdateUserDto \} from ''", "import { UpdateUserDto } from './dto/update-user.dto'"
    $content = $content -replace "import \{ CreateClientDto \} from ''", "import { CreateClientDto } from './dto/create-client.dto'"
    $content = $content -replace "import \{ UpdateClientDto \} from ''", "import { UpdateClientDto } from './dto/update-client.dto'"
    $content = $content -replace "import \{ CreateMessageDto \} from ''", "import { CreateMessageDto } from './dto/create-message.dto'"
    $content = $content -replace "import \{ LoginDto \} from ''", "import { LoginDto } from './dto/login.dto'"
    $content = $content -replace "import \{ RegisterDto \} from ''", "import { RegisterDto } from './dto/register.dto'"
    $content = $content -replace "import \{ RefreshTokenDto \} from ''", "import { RefreshTokenDto } from './dto/refresh-token.dto'"
    
    # Strategies
    $content = $content -replace "import \{ JwtStrategy \} from ''", "import { JwtStrategy } from './strategies/jwt.strategy'"
    $content = $content -replace "import \{ RefreshStrategy \} from ''", "import { RefreshStrategy } from './strategies/refresh.strategy'"
    
    # Guards and Decorators
    $content = $content -replace "import \{ JwtAuthGuard \} from ''", "import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'"
    $content = $content -replace "import \{ RolesGuard \} from ''", "import { RolesGuard } from '../../common/guards/roles.guard'"
    $content = $content -replace "import \{ Roles \} from ''", "import { Roles } from '../../common/decorators/roles.decorator'"
    $content = $content -replace "import \{ User \} from ''", "import { User } from '../../common/decorators/user.decorator'"
    
    # Exports in index.ts files
    if ($file.Name -eq "index.ts") {
        $moduleName = $file.Directory.Name
        $content = $content -replace "export \* from ''", "export * from './$moduleName'"
    }
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "✓ Restauração concluída!" -ForegroundColor Green
