require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// CONFIGURAÇÃO CORS PARA PRODUÇÃO
app.use(cors({
    origin: [
        'https://codigo-collab.github.io',  // Seu GitHub Pages
        'https://teste-2-7aqL.onrender.com', // Seu Render
        'http://localhost:3000',
        'http://127.0.0.1:5500'
    ],
    credentials: true
}));

// Middleware para headers CORS
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://codigo-collab.github.io',
        'https://teste-2-7aqL.onrender.com',
        'http://localhost:3000',
        'http://127.0.0.1:5500'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Responde preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// ✅ ROTA RAIZ - IMPORTANTE para Render
app.get("/", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API de Email funcionando!",
        server: "Render - teste-2-7aqL",
        routes: [
            "GET /health",
            "POST /send", 
            "GET /test-email"
        ],
        timestamp: new Date().toISOString()
    });
});

// Rota de health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Servidor rodando perfeitamente!",
        server: "Render - teste-2-7aqL", 
        timestamp: new Date().toISOString()
    });
});

// Rota principal de envio de email
app.post("/send", async (req, res) => {
    console.log('📧 Recebida requisição para /send');
    console.log('📍 Origem da requisição:', req.headers.origin);
    
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
            error: "Todos os campos são obrigatórios: nome, email, mensagem" 
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
            },
            debug: true, // Log detalhado
            logger: true
        });

        console.log('✅ Transporter configurado');
        console.log('   Email USER:', process.env.EMAIL_USER || '❌ Não configurado');
        console.log('   Email PASS:', process.env.EMAIL_PASS ? '✅ Configurado' : '❌ Não configurado');

        const mailOptions = {
            from: `Portfolio <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Enviar para o próprio email
            replyTo: email, // Para responder direto para a pessoa
            subject: `📧 Nova mensagem de ${name} - Portfolio`,
            text: `
NOVA MENSAGEM DO PORTFOLIO

Nome: ${name}
Email: ${email}
Mensagem: 
${message}

---
Enviado em: ${new Date().toLocaleString('pt-BR')}
            `,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            color: #333; 
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .content { 
            padding: 30px 20px; 
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        .field { 
            margin-bottom: 20px; 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .label { 
            font-weight: bold; 
            color: #667eea; 
            display: block;
            margin-bottom: 5px;
        }
        .message-content {
            background: white;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin-top: 10px;
        }
        .footer { 
            background: #f5f5f5; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        h1 {
            margin: 0;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nova Mensagem do Portfolio</h1>
            <p>Você recebeu uma nova mensagem de contato</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 Nome:</span>
                <span>${name}</span>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <span>${email}</span>
            </div>
            <div class="field">
                <span class="label">💬 Mensagem:</span>
                <div class="message-content">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
        <div class="footer">
            <p>🕒 Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p>📧 Sistema de Contato - Portfolio</p>
            <p><small>Responda diretamente para: ${email}</small></p>
        </div>
    </div>
</body>
</html>
            `
        };

        console.log('📤 Enviando email...');
        
        // Verificar configuração primeiro
        await transporter.verify();
        console.log('✅ Conexão com Gmail verificada');

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
        
        let errorMessage = "Erro ao enviar email";
        if (err.code === 'EAUTH') {
            errorMessage = "Erro de autenticação - verifique EMAIL_USER e EMAIL_PASS";
        } else if (err.code === 'ECONNECTION') {
            errorMessage = "Erro de conexão com o servidor de email";
        }
        
        res.status(500).json({ 
            success: false, 
            error: errorMessage,
            details: err.message
        });
    }
});

// Rota para testar configuração do email
app.get("/test-email", async (req, res) => {
    try {
        console.log('🧪 Testando configuração de email...');
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Testar a conexão
        await transporter.verify();
        
        console.log('✅ Teste de email: CONEXÃO OK');
        
        res.json({ 
            success: true, 
            message: "Conexão com Gmail configurada corretamente",
            email: process.env.EMAIL_USER,
            server: "Render - teste-2-7aqL"
        });
    } catch (err) {
        console.error('❌ Teste de email: FALHA', err);
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
        availableRoutes: [
            "GET /", 
            "GET /health", 
            "POST /send", 
            "GET /test-email"
        ],
        server: "Render - teste-2-7aqL"
    });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("=======================================");
    console.log("🚀 SERVIDOR INICIADO COM SUCESSO!");
    console.log("=======================================");
    console.log("📍 Porta:", PORT);
    console.log("🌐 Server: Render - teste-2-7aqL");
    console.log("📧 Email USER:", process.env.EMAIL_USER || "❌ NÃO CONFIGURADO");
    console.log("🔑 Email PASS:", process.env.EMAIL_PASS ? "✅ CONFIGURADO" : "❌ NÃO CONFIGURADO");
    console.log("=======================================");
    console.log("📍 URLs para teste:");
    console.log("   ✅ https://teste-2-7aqL.onrender.com");
    console.log("   ✅ https://teste-2-7aqL.onrender.com/health");
    console.log("   ✅ https://teste-2-7aqL.onrender.com/test-email");
    console.log("=======================================");
});
