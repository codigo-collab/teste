require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// CONFIGURAÇÃO CORS COMPLETA PARA DESENVOLVIMENTO
app.use(cors({
    origin: true, // Permite todas as origens em desenvolvimento
    credentials: true
}));

// Middleware para headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Responde preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Rota de health check para testar se o servidor está respondendo
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Servidor rodando",
        timestamp: new Date().toISOString()
    });
});

// Rota principal de envio de email
app.post("/send", async (req, res) => {
    console.log('📧 Recebida requisição para /send');
    console.log('📍 Origem da requisição:', req.headers.origin);
    console.log('📦 Headers:', req.headers);
    
    const { name, email, message } = req.body;

    console.log('🔍 Dados recebidos:');
    console.log('   Nome:', name);
    console.log('   Email:', email);
    console.log('   Mensagem:', message);

    // Validação básica
    if (!name || !email || !message) {
        console.log('❌ Dados incompletos');
        return res.status(400).json({ 
            success: false, 
            error: "Todos os campos são obrigatórios" 
        });
    }

    try {
        console.log('🔧 Configurando transporter do Gmail...');
        
        // CONFIGURAÇÃO PARA GMAIL
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log('✅ Transporter configurado');
        console.log('   Email USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ Não configurado');
        console.log('   Email PASS:', process.env.EMAIL_PASS ? '✅ Configurado' : '❌ Não configurado');
        console.log('   Email TO:', process.env.EMAIL_TO ? '✅ Configurado' : '❌ Não configurado');

        const mailOptions = {
            from: process.env.EMAIL_USER, // Usar o email configurado, não o do usuário
            to: process.env.EMAIL_TO,
            subject: `Contato de ${name} - Portfolio`,
            text: `
Nome: ${name}
Email: ${email}
Mensagem: ${message}

Enviado em: ${new Date().toLocaleString('pt-BR')}
            `,
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #667eea; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📧 Nova Mensagem para voce Maria</h1>
    </div>
    <div class="content">
        <div class="field">
            <span class="label">Nome:</span> ${name}
        </div>
        <div class="field">
            <span class="label">Email:</span> ${email}
        </div>
        <div class="field">
            <span class="label">Mensagem:</span><br>
            ${message.replace(/\n/g, '<br>')}
        </div>
    </div>
    <div class="footer">
        <p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
        <p>📧 Sistema de Contato - Portfolio</p>
    </div>
</body>
</html>
            `
        };

        console.log('📤 Enviando email...');
        
        // Enviar email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email enviado com sucesso!');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);

        res.json({ 
            success: true, 
            message: "Email enviado com sucesso!",
            messageId: info.messageId
        });

    } catch (err) {
        console.error('❌ Erro ao enviar email:', err);
        
        // Log mais detalhado do erro
        if (err.code) {
            console.error('   Código do erro:', err.code);
        }
        if (err.command) {
            console.error('   Comando:', err.command);
        }
        
        res.status(500).json({ 
            success: false, 
            error: err.message,
            code: err.code
        });
    }
});

// Rota para testar configuração do email
app.get("/test-email", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Testar a conexão
        await transporter.verify();
        
        res.json({ 
            success: true, 
            message: "Conexão com Gmail configurada corretamente",
            email: process.env.EMAIL_USER
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: "Falha na configuração do Gmail: " + err.message
        });
    }
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: "Rota não encontrada",
        availableRoutes: ["GET /health", "POST /send", "GET /test-email"]
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta " + PORT);
    console.log("📍 URLs para teste:");
    console.log("   http://localhost:" + PORT + "/health");
    console.log("   http://localhost:" + PORT + "/test-email");
    console.log("📧 Configuração de email:");
    console.log("   EMAIL_USER:", process.env.EMAIL_USER || "❌ Não configurado");
    console.log("   EMAIL_TO:", process.env.EMAIL_TO || "❌ Não configurado");
    console.log("   EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Configurado" : "❌ Não configurado");
});