# Plano de Treino — PWA (v3)

Site de treino com personagem 3D, **alternativas para aparelho ocupado**, **cronômetro de descanso inteligente** e **notificações push** no fim do descanso, funcionando como app instalado no iPhone e no Android.

---

## O que tem nesta versão

| Recurso | Como funciona |
|---|---|
| Aparelho ocupado | Cada exercício tem o botão **🚧 Aparelho ocupado**, que mostra de 3 a 4 substitutos ordenados pela **equivalência biomecânica (%)**. Cada substituto vem com músculos, equipamento, padrão de movimento, prescrição, diferenças em relação ao original e a animação 3D. |
| Troca temporária | **Usar esta** troca o exercício só no treino de hoje. **Voltar ao original** desfaz a troca. O histórico registra o exercício planejado e o executado (`plan` → `done`). |
| Cronômetro | Presets de 30, 45, 60, 90, 120 e 180 s, mais um tempo personalizado (0–900 s), configuráveis por exercício. O botão **Concluir série e iniciar descanso** marca a série e começa a contagem. Dá para pausar, reiniciar ou somar 15 ou 30 s. |
| Horário absoluto | O descanso é salvo como **horário de término** (`end`) no `localStorage`. Ele sobrevive a troca de aba, recarregamento, tela bloqueada e troca de app. |
| Fim do descanso | O app toca um som, vibra e mostra uma animação discreta, e destaca o botão **▶ Iniciar próxima série**, com o exercício e a série seguinte. |
| Push em segundo plano | O app envia o horário de término ao servidor (Netlify Functions). Uma *background function* espera até esse horário e envia o **Web Push**: "Descanso finalizado! Hora da próxima série. 💪". Pausar, pular ou somar tempo cancela ou reagenda o push. |
| Progresso | A aba **📈 Progresso** mostra treinos recentes, séries no mês, trocas feitas e melhores cargas. Cada exercício mostra o histórico de carga com um mini gráfico. |
| Backup | Os dados ficam salvos no aparelho. Há sincronização opcional com o servidor (código de sincronização) e exportação/importação em JSON. |

---

## Estrutura dos arquivos

```
treino-app/
├── index.html               ← o app completo (gerado a partir de src/)
├── manifest.webmanifest     ← configuração do PWA
├── sw.js                    ← service worker (cache offline + receber push)
├── icons/                   ← ícones do app (192, 512, maskable, apple-touch, badge)
├── netlify.toml             ← configuração do Netlify
├── package.json             ← dependências do backend (web-push, @netlify/blobs)
├── netlify/
│   ├── lib/common.mjs       ← chaves VAPID, validações, armazenamento
│   └── functions/
│       ├── push-key.mjs       GET  /api/push/key       → chave pública VAPID
│       ├── push-schedule.mjs  POST /api/push/schedule  → agenda o push do fim do descanso
│       ├── push-run.mjs       (background) espera e envia o push
│       ├── push-cancel.mjs    POST /api/push/cancel    → cancela (pausa/pular)
│       └── sync.mjs           GET/PUT /api/sync        → backup na nuvem
└── src/                     ← código-fonte editável
    ├── index.tpl.html, base.css, extra.css
    ├── coach.js             ← personagem 3D + animações
    ├── data.js              ← dias, exercícios, receitas
    ├── exdb.js              ← BASE DE SUBSTITUIÇÕES (músculos, equipamento, padrão, equivalência)
    ├── app.js               ← lógica do app
    └── build.py             ← junta tudo em index.html
```

Para editar, mude os arquivos em `src/` e rode `python3 src/build.py`. O `index.html` é regenerado.

---

## Publicar no Netlify (com notificações)

> O backend de push usa **Netlify Functions**, que precisam ser instaladas no deploy. Por isso use o **deploy via GitHub**. O método de arrastar e soltar publica só o site estático: o app funciona, mas sem push em segundo plano.

### Opção A — GitHub (recomendado, sem terminal)
1. Crie uma conta em **github.com** e um repositório novo (ex.: `treino`). Pode ser privado.
2. No repositório, toque em **Add file → Upload files** e envie **todo o conteúdo** da pasta `treino-app`: `index.html`, `sw.js`, `manifest.webmanifest`, `netlify.toml`, `package.json`, e as pastas `icons/`, `netlify/` e `src/`. Depois, **Commit**.
3. No **app.netlify.com**, vá em **Add new project → Import an existing project → GitHub** e escolha o repositório.
4. Deixe as configurações como estão (o `netlify.toml` já define tudo) e clique em **Deploy**.
5. Abra o endereço `https://SEU-SITE.netlify.app/api/push/key`. Se aparecer `{"publicKey":"..."}`, o backend está funcionando.

Para atualizar o site depois, envie os arquivos novos no GitHub. O Netlify publica sozinho.

### Opção B — Netlify CLI (terminal)
```bash
npm install -g netlify-cli
cd treino-app
npm install
netlify deploy --prod
```

### Variáveis de ambiente (opcionais)
Sem configurar nada, o servidor **gera as chaves VAPID sozinho** na primeira vez e as guarda no Netlify Blobs. Se preferir, configure em **Project configuration → Environment variables**:

| Variável | Exemplo | Para quê |
|---|---|---|
| `VAPID_SUBJECT` | `mailto:seuemail@gmail.com` | Contato exigido pelos serviços de push (recomendado). Sem ele, o servidor usa a URL do site. |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | gerar com `npx web-push generate-vapid-keys` | Fixar as chaves manualmente. |

Se trocar as chaves, cada aparelho precisa tocar em **Ativar notificações** de novo.

---

## Instalar e testar no iPhone (iOS 16.4 ou mais novo)

No iPhone, o push **só funciona com o app instalado na tela inicial**.

1. Abra `https://SEU-SITE.netlify.app` no **Safari**.
2. Toque em **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início** → **Adicionar**.
3. Abra o app **pelo ícone** (não pelo Safari).
4. Vá em **📈 Progresso → Ativar notificações** e toque em **Permitir**. O pedido só aparece depois de um toque seu, como o iOS exige.
5. Toque em **Enviar teste (5 s)** e **bloqueie a tela**. A notificação de teste deve chegar em ~5 segundos.
6. Teste real: abra um treino, toque em **Concluir série e iniciar descanso**, bloqueie a tela e espere o tempo acabar.

Se a notificação não chegar:
- Confira **Ajustes → Notificações → Treino** (precisa estar permitido).
- O **Modo Foco** ou o **Não Perturbe** pode silenciar o aviso.
- Se você recusou a permissão, ela só pode ser liberada em **Ajustes → Notificações → Treino**. Se o app não aparecer lá, remova o app da tela inicial e instale de novo.

## Instalar e testar no Android (Chrome)
1. Abra o site no **Chrome**.
2. Toque em **Instalar app** (o banner, o botão em **📈 Progresso** ou o menu ⋮ → **Instalar app**).
3. Abra o app, toque em **Ativar notificações** e permita.
4. Toque em **Enviar teste (5 s)**, bloqueie a tela e aguarde.

Se não chegar:
- Em **Configurações → Apps → Treino (ou Chrome) → Bateria**, coloque **Sem restrições**. A economia de bateria pode atrasar notificações.
- Confira se as notificações do Chrome e do site estão ativas.

## No computador
Funciona em Chrome, Edge e Firefox. Para receber push, o navegador precisa estar aberto (pode estar minimizado).

---

## Como o cronômetro garante precisão

- Nada depende de `setInterval` para medir tempo. O intervalo só **redesenha** a tela; o tempo restante é sempre `end − agora`.
- O estado (`end`, `status`, `total`, próxima série) fica salvo no `localStorage` a cada mudança. Ao reabrir o app, o cronômetro é recalculado pelo horário real. Se o descanso terminou enquanto o app estava fechado, ele já abre no estado **"Descanso finalizado"**.
- O alerta em segundo plano **não** é prometido por `setTimeout` no navegador. Quem dispara é o **servidor**, que manda o push no horário de término.
- Cada agendamento tem uma **versão**. Se você pausa, pula, reinicia ou soma 15/30 s, a versão antiga é invalidada e só o horário mais recente gera notificação.

### Modos de agendamento (📈 Progresso → Alertas de descanso)
- **Sempre que o descanso começar** (padrão): é o modo mais confiável.
- **Só quando o app sai da tela**: agenda o push no momento em que você bloqueia a tela ou troca de app, e cancela quando você volta. Economiza créditos do Netlify, mas depende do navegador conseguir enviar o pedido ao sair. Teste no seu celular antes de confiar.

### Custo no Netlify (plano gratuito)
A função que espera o fim do descanso consome tempo de computação enquanto aguarda. Exemplo: 20 descansos de ~90 s por dia são cerca de 30 min por dia de função em espera. O plano gratuito tem uma cota mensal de créditos. Acompanhe o uso em **Usage & billing**. Se ficar apertado, use o modo **"Só quando o app sai da tela"**.

---

## Tratamento de erros

| Situação | O que o app faz |
|---|---|
| Permissão negada | Mostra como liberar nos ajustes. O som, a vibração e o aviso dentro do app continuam funcionando. |
| iPhone fora da tela inicial | Explica como instalar antes de pedir permissão. |
| Navegador sem suporte a push | Avisa e usa só o alerta com o app aberto. |
| Backend indisponível (ex.: deploy por arrastar e soltar) | `/api/push/key` falha, o status mostra **"Sem servidor"** e os alertas funcionam só com o app aberto. |
| Falha ao agendar | Mostra um aviso para manter o app aberto naquele descanso. O cronômetro local continua normalmente. |
| Inscrição expirada (404/410) | O servidor descarta a inscrição. Basta tocar em **Ativar notificações** de novo. |
| Sem internet | O app abre pelo cache do service worker, e o 3D funciona se já tiver sido carregado antes. |

---

## Base de substituições (`src/exdb.js`)

- `EXDB[id]` guarda nome, músculos (`m`), equipamento (`eq`), padrão de movimento (`pat`), dica (`c`) e repetições sugeridas (`r`).
- `SUBS[id]` guarda a lista de `[alternativa, equivalência %, "diferenças"]`.
- A equivalência considera o grupo muscular principal, o padrão de movimento, a amplitude, o perfil de resistência e a carga possível. É uma estimativa prática, não uma medida eletromiográfica.

Para adicionar uma alternativa, crie a entrada em `EXDB` e coloque-a em `SUBS` do exercício original. Para reaproveitar uma animação existente, use `anim: "idDaAnimacao"`.

---

## Testar localmente (opcional)
```bash
npm install
npx netlify-cli dev     # abre http://localhost:8888 com as funções e o Blobs local
```
O `localhost` é tratado como seguro, então o service worker e o push funcionam no Chrome do computador.

## Privacidade
- Os dados ficam no aparelho. O servidor só recebe a inscrição de push e o horário do descanso (apagados após o envio) e, se você usar, o backup.
- O **código de sincronização** funciona como uma senha. Não compartilhe.
