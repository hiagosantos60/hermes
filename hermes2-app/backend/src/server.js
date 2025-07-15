const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Módulo para interagir com o sistema de arquivos
const csv = require('csv-parser'); // Módulo para ler o CSV

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Caminho para o arquivo CSV, subindo um nível do diretório 'src' para 'data'
const csvPath = path.resolve(__dirname, '..', 'data', 'tabela_tranferencia_csv.csv');

// Endpoint da API para transferência
app.get('/api/transferencia', (req, res) => {
    const results = [];
    fs.createReadStream(csvPath)
        .pipe(csv({ separator: ';' })) // Usamos o ponto e vírgula como delimitador, conforme o arquivo
        .on('data', (data) => {
            // Renomeia as chaves para corresponder ao que o frontend espera (ex: 'codigo' em vez de 'CODIGO')
const formattedData = {
    id: data.id || null,
    segmento: data.segmento,
    codigo: data.codigo,
    produto: data.produto,
    segmento_telefone: data.segmento_telefone,
    segmento_blip: data.segmento_blip
};

            results.push(formattedData);
        })
        .on('end', () => {
            console.log('Dados do CSV lidos e enviados com sucesso.');
            res.json(results);
        })
        .on('error', (error) => {
            console.error('Erro ao ler o arquivo CSV:', error.message);
            res.status(500).json({ erro: 'Falha ao ler os dados.' });
        });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
