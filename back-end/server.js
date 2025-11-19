require("dotenv").config();
const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");

const app = express();

// CONFIGURAÇÃO CORS PARA PRODUÇÃO
app.use(cors({
    origin: [
        'https://codigo-collab.github.io',  // Seu GitHub Pages
        'https://teste-2-89b4.onrender.com', // ✅ NOVO SERVIDOR
        'http://localhost:3000',
        'http://127.0.0.1:5500'
    ],
    credentials: true
}));

app.use(express.json());

// ✅ ROTA RAIZ - IMPORTANTE para Render
app.get("/", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API de Email funcionando com Resend!",
        server: "Render - teste-2-89b4", // ✅ NOVO SERVIDOR
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
        message: "Servidor rodando perfeitamente com Resend!",
        server: "Render - teste-2-89b4", // ✅ NOVO SERVIDOR
        timestamp: new Date().toISOString()
    });
});

// Rota principal de envio de email COM RESEND
app.post("/send", async (req, res) => {
    console.log('📧 Recebida requisição para /send');
    console.log('📍 Origem:', req.headers.origin);
    
    const { name, email, message } = req.body;

    console.log('🔍 Dados recebidos:');
    console.log('   Nome:', name);
    console.log('   Email:', email);
    console.log('   Mensagem:', message);

    // Validação
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            error: "Todos os campos são obrigatórios" 
        });
    }

    try {
        console.log('🔧 Configurando Resend...');
        
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log('📤 Enviando email via Resend...');
        
        const { data, error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['ian.fotos123@gmail.com'], // Email que recebe as mensagens
            reply_to: email,
            subject: `📧 Nova mensagem de ${name} - Portfolio`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none; }
        .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; }
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
                <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
        <div class="footer">
            <p>🕒 Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p>📧 Sistema de Contato - Portfolio</p>
            <p><small>Responda para: ${email}</small></p>
        </div>
    </div>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Erro do Resend:', error);
            throw new Error(error.message);
        }

        console.log('✅ Email enviado com Resend! ID:', data.id);
        
        res.json({ 
            success: true, 
            message: "Email enviado com sucesso!",
            id: data.id
        });

    } catch (err) {
        console.error('❌ Erro ao enviar email:', err);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao enviar email. Tente novamente."
        });
    }
});

// Rota para testar Resend
app.get("/test-email", async (req, res) => {
    try {
        console.log('🧪 Testando Resend...');
        
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['ian.fotos123@gmail.com'],
            subject: '✅ Teste do Portfolio - RESEND',
            html: '<h2>Teste do Portfolio</h2><p>Se você recebeu este email, o Resend está funcionando!</p>',
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log('✅ Teste de email enviado! ID:', data.id);
        
        res.json({ 
            success: true, 
            message: "Email de teste enviado com sucesso!",
            id: data.id
        });
    } catch (err) {
        console.error('❌ Erro no teste:', err);
        res.status(500).json({ 
            success: false, 
            error: "Falha no teste: " + err.message
        });
    }
});

// Rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: "Rota não encontrada",
        availableRoutes: [
            "GET /", 
            "GET /health", 
            "POST /send", 
            "GET /test-email"
        ]
    });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("=======================================");
    console.log("🚀 SERVIDOR INICIADO COM RESEND!");
    console.log("=======================================");
    console.log("📍 Porta:", PORT);
    console.log("🌐 Server: Render - teste-2-89b4"); // ✅ NOVO SERVIDOR
    console.log("📧 Resend Configurado:", process.env.RESEND_API_KEY ? "✅ SIM" : "❌ NÃO");
    console.log("=======================================");
});
