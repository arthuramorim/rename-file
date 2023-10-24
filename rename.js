const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const dotenv = require('dotenv'); // Importa a biblioteca dotenv

// Carrega as variáveis de ambiente a partir do arquivo .env
dotenv.config();

const diretorio = process.env.DIRETORIO;
const nomeArquivo = process.env.NOME_ARQUIVO;
const novoNome = process.env.NOVO_NOME;
const novoNomeDiretorio = process.env.NOVO_NOME_DIRETORIO;

function renomearArquivosNoDiretorio(caminhoDiretorio) {
    fs.readdirSync(caminhoDiretorio).forEach((nome_arquivo) => {
        if (nome_arquivo.startsWith(nomeArquivo)) {
            const novo_nome = nome_arquivo.slice(nomeArquivo.length);
            const caminho_original = path.join(caminhoDiretorio, nome_arquivo);
            const caminho_novo = path.join(caminhoDiretorio, novo_nome);

            fs.renameSync(caminho_original, caminho_novo);
        }
    });
}

fs.readdirSync(diretorio).forEach((nome_arquivo) => {
    if (nome_arquivo.startsWith(nomeArquivo) && nome_arquivo.endsWith('.zip')) {
        const caminho_original = path.join(diretorio, nome_arquivo);
        const caminho_descompactado = path.join(diretorio, nome_arquivo.slice(nomeArquivo.length, -4));

        fs.createReadStream(caminho_original)
            .pipe(unzipper.Extract({ path: caminho_descompactado }))
            .on('close', () => {
                renomearArquivosNoDiretorio(caminho_descompactado);
            });
    }
});

console.log("Processo concluído.");
