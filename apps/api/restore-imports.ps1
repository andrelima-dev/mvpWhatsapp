# Script para restaurar imports corrompidos
# Mapeia todos os imports vazios para os caminhos corretos

$mappings = @{
    # Config files
    "import configuration from ''" = "import configuration from './config/configuration'"
    "import validationSchema from ''" = "import validationSchema from './config/validation'"
    
    # Infrastructure
    "import { PrismaModule } from ''" = "import { PrismaModule } from './infrastructure/prisma/prisma.module'"
    "import { PrismaService } from ''" = "import { PrismaService } from './infrastructure/prisma/prisma.service'"
    "import { PrismaService } from '../../'" = "import { PrismaService } from '../../infrastructure/prisma/prisma.service'"
    
    # Auth Module
    "import { AuthModule } from ''" = "import { AuthModule } from './modules/auth/auth.module'"
    "import { AuthService } from ''" = "import { AuthService } from './auth.service'"
    "import { JwtStrategy } from ''" = "import { JwtStrategy } from './strategies/jwt.strategy'"
    "import { RefreshStrategy } from ''" = "import { RefreshStrategy } from './strategies/refresh.strategy'"
    "import { TokensService } from ''" = "import { TokensService } from './tokens.service'"
    "import { JwtAuthGuard } from ''" = "import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'"
    
    # Users Module
    "import { UsersModule } from ''" = "import { UsersModule } from './modules/users/users.module'"
    "import { UsersService } from ''" = "import { UsersService } from './users.service'"
    "import { UsersController } from ''" = "import { UsersController } from './users.controller'"
    "import { CreateUserDto } from ''" = "import { CreateUserDto } from './dto/create-user.dto'"
    "import { UpdateUserDto } from ''" = "import { UpdateUserDto } from './dto/update-user.dto'"
    
    # Clients Module
    "import { ClientsModule } from ''" = "import { ClientsModule } from './modules/clients/clients.module'"
    "import { ClientsService } from ''" = "import { ClientsService } from './clients.service'"
    "import { ClientsController } from ''" = "import { ClientsController } from './clients.controller'"
    "import { CreateClientDto } from ''" = "import { CreateClientDto } from './dto/create-client.dto'"
    "import { UpdateClientDto } from ''" = "import { UpdateClientDto } from './dto/update-client.dto'"
    
    # Conversations Module
    "import { ConversationsModule } from ''" = "import { ConversationsModule } from './modules/conversations/conversations.module'"
    "import { ConversationsService } from ''" = "import { ConversationsService } from './conversations.service'"
    "import { ConversationsController } from ''" = "import { ConversationsController } from './conversations.controller'"
    "import { ConversationsGateway } from ''" = "import { ConversationsGateway } from './conversations.gateway'"
    
    # Messages Module
    "import { MessagesModule } from ''" = "import { MessagesModule } from './modules/messages/messages.module'"
    "import { MessagesService } from ''" = "import { MessagesService } from './messages.service'"
    "import { MessagesController } from ''" = "import { MessagesController } from './messages.controller'"
    "import { CreateMessageDto } from ''" = "import { CreateMessageDto } from './dto/create-message.dto'"
    
    # Assignments Module
    "import { AssignmentsModule } from ''" = "import { AssignmentsModule } from './modules/assignments/assignments.module'"
    "import { AssignmentsService } from ''" = "import { AssignmentsService } from './assignments.service'"
    
    # WhatsApp Module
    "import { WhatsappModule } from ''" = "import { WhatsappModule } from './modules/whatsapp/whatsapp.module'"
    "import { WhatsappService } from ''" = "import { WhatsappService } from './whatsapp.service'"
    "import { WhatsappController } from ''" = "import { WhatsappController } from './whatsapp.controller'"
    
    # Common/Guards/Decorators
    "import { RolesGuard } from ''" = "import { RolesGuard } from '../../common/guards/roles.guard'"
    "import { Roles } from ''" = "import { Roles } from '../../common/decorators/roles.decorator'"
    "import { User } from ''" = "import { User } from '../../common/decorators/user.decorator'"
    
    # Index exports
    "export * from ''" = "export * from './{FILENAME}'"
}

Write-Host "Restaurando imports..." -ForegroundColor Green

Get-ChildItem -Path "src" -Recurse -Filter *.ts | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    $modified = $false
    
    foreach ($key in $mappings.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $replacement = $mappings[$key]
            
            # Handle special case for index.ts files
            if ($_.Name -eq "index.ts" -and $replacement -match '\{FILENAME\}') {
                # For index.ts, export from the same-named files
                $dirname = (Get-Item $filePath).Directory.Name
                $replacement = $replacement -replace '\{FILENAME\}', $dirname
            }
            
            $content = $content -replace [regex]::Escape($key), $replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "✓ $($_.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "✓ Imports restaurados!" -ForegroundColor Green
