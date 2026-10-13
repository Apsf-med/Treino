var DAYS=[
{key:"seg",short:"SEG",name:"Segunda",title:"Peito + Tríceps",
 warm:"5 min de bike/elíptico + 2 séries leves de flexão + mobilidade de ombro (rotação com bastão).",
 tip:"Pegadinha comum: deixar o ombro subir no supino. Mantenha a escápula retraída e deprimida durante toda a série.",
 ex:[
 {a:"bench",n:"Supino reto com barra",s:4,r:"6–10",rest:150,rt:"2–3 min",c:"Escápulas retraídas e deprimidas, pés firmes no chão. Barra desce controlada até a linha do mamilo."},
 {a:"incline",n:"Supino inclinado com halteres",s:3,r:"8–12",rest:90,rt:"90 s",c:"Banco a 30–45°. Desça até sentir o peitoral alongar e suba sem bater os halteres."},
 {a:"cablefly",n:"Crucifixo na máquina / crossover",s:3,r:"10–15",rest:0,rt:"0 s",bs:"A",c:"Cotovelos levemente flexionados e fixos — o movimento é de abraçar, não de empurrar."},
 {a:"pushdown",n:"Tríceps na corda (polia)",s:3,r:"10–15",rest:75,rt:"60–90 s",bs:"B",c:"Cotovelos colados ao tronco; abra a corda no final para contrair o tríceps."},
 {a:"skull",n:"Tríceps testa",s:3,r:"8–12",rest:75,rt:"60–90 s",c:"Cotovelos apontando para cima e parados — só o antebraço se move."},
 {a:"benchdip",n:"Mergulho entre bancos",s:2,r:"12–15",rest:60,rt:"60 s",c:"Ombros longe das orelhas; desça até ~90° de cotovelo, sem forçar a frente do ombro."}]},
{key:"ter",short:"TER",name:"Terça",title:"Costas + Bíceps",
 warm:"5 min de remo ergômetro ou bike + 2 séries leves de puxada + rotação de punho/ombro.",
 tip:"Puxe com os cotovelos, não com as mãos — pense em levar o cotovelo ao bolso para ativar a dorsal, não o bíceps.",
 ex:[
 {a:"pulldown",n:"Puxada alta",s:4,r:"8–12",rest:90,rt:"90 s",c:"Peito alto, puxe a barra até a parte alta do peito sem jogar o tronco para trás."},
 {a:"bbrow",n:"Remada curvada",s:3,r:"6–10",rest:120,rt:"2 min",c:"Coluna neutra, tronco a ~45°. Puxe a barra em direção ao umbigo."},
 {a:"dbrow",n:"Remada unilateral",s:3,r:"8–12",rest:0,rt:"0 s",bs:"A",c:"Apoio firme no banco, cotovelo vai ao bolso, sem girar o tronco."},
 {a:"cablerow",n:"Remada baixa / cavalinho",s:3,r:"10–12",rest:75,rt:"60–90 s",bs:"B",c:"Peito aberto; segure 1 s com as escápulas juntas no final."},
 {a:"curl",n:"Rosca direta",s:3,r:"8–12",rest:0,rt:"0 s",bs:"A",c:"Cotovelos fixos ao lado do corpo, sem balanço. Desça em 2–3 s."},
 {a:"hammer",n:"Rosca martelo",s:3,r:"10–12",rest:75,rt:"60–90 s",bs:"B",c:"Pegada neutra; controle a descida e não deixe o ombro roubar."}]},
{key:"qua",short:"QUA",name:"Quarta",title:"Pernas (quadríceps)",amrap:true,
 warm:"5–8 min de bike + mobilidade de quadril/tornozelo + 1 série leve de agachamento livre (sem carga).",
 tip:"O AMRAP só entra depois das pernas se a técnica do agachamento não for comprometida pela fadiga. Caso contrário, deixe para sábado.",
 ex:[
 {a:"squat",n:"Agachamento livre",s:4,r:"6–10",rest:150,rt:"2–3 min",c:"Pés na largura dos ombros, joelhos acompanham a ponta dos pés, coluna neutra durante toda a descida."},
 {a:"legpress",n:"Leg press 45°",s:3,r:"8–12",rest:120,rt:"2 min",c:"Lombar sempre apoiada; não trave os joelhos no topo."},
 {a:"legext",n:"Cadeira extensora",s:3,r:"10–15",rest:0,rt:"0 s",bs:"A",c:"Segure 1 s no topo e desça em 2–3 s."},
 {a:"legcurl",n:"Mesa flexora",s:3,r:"10–15",rest:75,rt:"60–90 s",bs:"B",c:"Quadril colado no banco; controle a volta. Ótimo par antagonista da extensora."},
 {a:"calf",n:"Panturrilha em pé ou sentado",s:4,r:"10–15",rest:50,rt:"45–60 s",c:"Amplitude total, com pausa de 1–2 s embaixo no alongamento."}]},
{key:"qui",short:"QUI",name:"Quinta",title:"Ombros + Abdômen",
 warm:"5 min de cardio leve + rotação de ombro com elástico (3 × 15, carga mínima).",
 tip:"Elevação lateral: evite balançar o tronco. Se precisar de impulso, a carga está pesada demais.",
 ex:[
 {a:"ohp",n:"Desenvolvimento com halteres",s:4,r:"6–10",rest:105,rt:"90 s–2 min",c:"Core firme, sem arquear a lombar. Halteres descem até a altura das orelhas."},
 {a:"latraise",n:"Elevação lateral",s:4,r:"10–15",rest:0,rt:"0 s",bs:"A",c:"Cotovelo levemente flexionado, suba até a linha do ombro, sem impulso."},
 {a:"facepull",n:"Face pull",s:3,r:"12–15",rest:50,rt:"45–60 s",bs:"B",c:"Corda na altura dos olhos; puxe abrindo as mãos para os lados da cabeça."},
 {a:"revfly",n:"Crucifixo inverso",s:3,r:"10–15",rest:60,rt:"60 s",c:"Tronco estável, carga leve, foco no deltoide posterior."},
 {a:"cablecrunch",n:"Abdominal na polia",s:3,r:"10–15",rest:0,rt:"0 s",bs:"A",c:"Enrole a coluna flexionando o tronco — não puxe com os braços."},
 {a:"legraise",n:"Elevação de pernas",s:3,r:"10–15",rest:45,rt:"45 s",bs:"B",c:"Sem balanço; no topo, leve a pelve para trás (retroversão)."}]},
{key:"sex",short:"SEX",name:"Sexta",title:"Glúteos + Posterior",
 warm:"5 min de cardio leve + ativação de glúteo (ponte/clamshell, 2 × 15) antes da carga pesada.",
 tip:"No terra romeno, a barra desce colada nas pernas; o alongamento deve ser no posterior de coxa, não na lombar.",
 ex:[
 {a:"rdl",n:"Levantamento terra romeno",s:4,r:"6–10",rest:150,rt:"2–3 min",c:"Quadril vai para trás, barra colada nas pernas, coluna neutra."},
 {a:"hipthrust",n:"Hip thrust",s:4,r:"8–12",rest:105,rt:"90 s–2 min",c:"Queixo levemente para baixo; no topo, tronco paralelo ao chão e 1 s de contração."},
 {a:"seatcurl",n:"Cadeira flexora",s:3,r:"10–15",rest:60,rt:"60 s",c:"Controle a volta — a fase excêntrica é metade do estímulo."},
 {a:"bulgarian",n:"Afundo / Búlgaro",s:3,r:"8–12 por perna",rest:75,rt:"60–90 s",c:"Tronco levemente inclinado à frente para focar glúteo; joelho estável."},
 {a:"abduction",n:"Abdução de quadril",s:3,r:"12–20",rest:0,rt:"0 s",bs:"A",c:"Segure 1 s na abertura máxima."},
 {a:"calf",n:"Panturrilha",s:3,r:"10–15",rest:50,rt:"45–60 s",bs:"B",c:"Amplitude completa, sem quicar embaixo."}]},
{key:"sab",short:"SÁB",name:"Sábado",title:"AMRAP + Mobilidade",sat:true},
{key:"dom",short:"DOM",name:"Domingo",title:"Descanso",off:true}
];
var STATIONS=[["Barra fixa","5–8","pullup","Pegada pronada um pouco mais aberta que os ombros. Suba até o queixo passar a barra e desça controlando até estender os braços."],["Flexões","10–15","pushup","Corpo em prancha, mãos sob os ombros, cotovelos a ~45° do tronco. Desça até o peito quase tocar o chão."],["Agachamentos livres","15–20","airsquat","Quadril para trás e para baixo, joelhos alinhados com a ponta dos pés, tronco firme e calcanhares no chão."],["Mountain climbers","20 (10/lado)","climber","Mãos sob os ombros e quadril baixo. Leve os joelhos ao peito alternando, em ritmo constante."]];
var TIPS=[
["🎯","RIR 1–3","Termine as séries de hipertrofia com 1–3 repetições em reserva. Técnica primeiro, falha de vez em quando."],
["📈","Progressão","Bateu o topo da faixa de reps em todas as séries com boa execução? Aumente a carga."],
["⏱️","Descanso","2–3 min nos compostos pesados; 45–90 s nos isoladores. O cronômetro do app já usa o tempo de cada exercício."],
["🔥","Aquecimento","5–10 min de aquecimento específico antes da musculação — cada dia tem o seu."],
["🔄","Deload","A cada 4–6 semanas: −40% nas séries, mesma carga. Recupera articulações e SNC."],
["😴","Sono","7–9 h por noite. Impacta a hipertrofia tanto quanto o treino em si."],
["🥩","Proteína","~1,6–2,2 g/kg/dia, distribuída em 3–5 refeições."],
["📝","Registre","Anote cargas, reps e rodadas. O app salva a carga de cada exercício no seu celular."],
["⚡","AMRAP","Técnica > velocidade. Se a forma cair, reduza o ritmo ou pare."],
["🧠","Bi-set","A → sem descanso → B → descanse. Só nos isoladores, para preservar carga nos compostos."]
];
var NTIPS=[
"O saldo calórico define se você ganha ou perde gordura: déficit para perder, superávit para ganhar, manutenção para recompor devagar.",
"Proteína é prioridade: ~1,6–2,2 g/kg/dia em 3–5 refeições, para preservar/ganhar músculo mesmo em déficit.",
"Carboidrato não é vilão: sustenta a intensidade (pernas e AMRAP). Concentre a maior parte perto do treino.",
"Gordura boa não deve faltar (azeite, abacate, oleaginosas, ovo).",
"Água ao longo do dia: 35–40 ml/kg. Desidratação leve já reduz performance.",
"Não precisa comer de 3 em 3 horas — o que importa é o total do dia. Ajuste à rotina de faculdade/estágio.",
"Ultraprocessados e álcool em excesso atrapalham o déficit e a recuperação: exceção, não regra."
];
var RECIPES=[
{g:"🍳 Café da manhã",items:[
["Omelete proteico com aveia","Rápido • pré ou pós-treino","~30 g","3 ovos; 2 col. sopa de aveia; espinafre ou tomate; sal, orégano, pimenta; fio de azeite.","Bata os ovos com a aveia. Refogue o espinafre/tomate no azeite, junte os ovos e cozinhe tampado em fogo médio-baixo até firmar. Dobre e sirva."],
["Panqueca de banana e whey","Sem açúcar refinado • pré-treino","~25 g","1 banana amassada; 2 ovos; 1 scoop de whey (ou 2 col. de aveia); 1 col. chá de fermento; canela.","Misture tudo. Doure pequenas porções na frigideira antiaderente, 2–3 min de cada lado. Sirva com canela ou pasta de amendoim."],
["Tapioca com ovo e queijo","Sem glúten • rápido","~18 g","2 col. sopa de goma; 1 ovo mexido; 30 g de queijo minas ou cottage; sal e orégano.","Peneire a goma na frigideira quente formando um disco, deixe firmar 1–2 min, vire, recheie e dobre."],
["Iogurte com granola e frutas vermelhas","Sem cozinhar","~15–20 g","1 pote de iogurte natural ou grego; 2 col. de granola sem açúcar; ½ xícara de frutas vermelhas; mel opcional.","Monte em camadas num pote. Mais proteína se usar iogurte grego."]]},
{g:"🍗 Almoço",items:[
["Frango grelhado, arroz e brócolis","Base • ótimo para meal prep","~40 g","150 g de peito de frango; 4 col. sopa de arroz cru; 1 xícara de brócolis; alho, limão, sal, páprica; 1 col. chá de azeite.","Tempere e grelhe o frango 5–7 min por lado. Cozinhe o arroz e o brócolis no vapor por 5 min. Finalize com azeite."],
["Risoto de frango fit","Rende 2 dias","~35 g","150 g de frango em cubos; 1 xícara de arroz arbóreo; ½ cebola; 2 dentes de alho; 3 xícaras de caldo caseiro; 1 col. de parmesão.","Refogue cebola e alho, sele o frango 3–4 min, junte o arroz. Adicione o caldo aos poucos, mexendo, 18–20 min. Parmesão fora do fogo."],
["Carne moída com batata-doce","Clássico fitness","~35 g","150 g de patinho moído; 1 batata-doce média; ½ xícara de brócolis/vagem; cebola, alho, cominho.","Refogue cebola e alho, doure a carne. Batata-doce no vapor ou forno; legumes no vapor 5 min."],
["Macarrão integral com frango","Prático • congela bem","~40 g","80 g de macarrão integral cru; 150 g de frango; ½ xícara de molho de tomate; alho; manjericão.","Cozinhe a massa. Doure o frango no alho, junte o molho e apure 5–8 min. Misture e finalize com manjericão."]]},
{g:"🥪 Lanche da tarde",items:[
["Wrap de atum ou frango","Leve para a faculdade • 10 min","~25–30 g","1 lata de atum em água (ou 100 g de frango); 1 tortilha integral; 2 col. de iogurte/requeijão light; alface, tomate, cenoura; limão.","Misture a proteína com iogurte, sal e limão. Espalhe na tortilha, adicione os vegetais, enrole e corte."],
["Vitamina de banana e pasta de amendoim","Pós-treino rápido","~30 g","1 banana congelada; 1 scoop de whey; 1 col. de pasta de amendoim; 200 ml de leite; gelo.","Bata tudo até ficar cremoso."],
["Sanduíche natural de frango","Pré-treino","~25 g","2 fatias de pão integral; 80 g de frango desfiado; 1 col. de iogurte; alface e tomate.","Misture frango, iogurte, sal e limão e monte o sanduíche."],
["Mix de castanhas com fruta","Sem preparo","—","25–30 g de castanhas variadas; 1 fruta.","Porcione e leve na mochila. Calórico: controle a porção."]]},
{g:"🐟 Janta",items:[
["Peixe assado com legumes","Leve à noite","~35 g","150 g de tilápia ou salmão; 1 abobrinha; 1 cenoura; alho, limão, ervas; 1 col. chá de azeite.","Tempere, disponha com os legumes, regue com azeite e asse a 200 °C por 15–20 min."],
["Sopa de lentilha com frango","Pós-treino de pernas","~30 g","1 xícara de lentilha; 100 g de frango desfiado; cebola, cenoura, alho; caldo; cominho.","Refogue, junte cenoura e lentilha, cubra com caldo e cozinhe 20–25 min. Frango nos últimos 5 min."],
["Omelete de claras com cottage","Baixa caloria","~30 g","4–5 claras; 50 g de cottage; salada a gosto.","Bata as claras com sal e orégano, cozinhe em fogo baixo, cottage por cima e dobre."],
["Frango ao curry light","Foge do básico","~35 g","150 g de frango; 1 col. chá de curry; ½ xícara de leite de coco light; cenoura e abobrinha; cebola e alho.","Doure o frango com curry, junte legumes e leite de coco, 10–12 min em fogo médio."]]},
{g:"🍫 Docinhos fit",items:[
["Brigadeiro fit","A doçura vem da banana","~5 g/un.","2 col. de cacau 100%; 1 banana madura; 1 scoop de whey chocolate; 1 col. de pasta de amendoim; granulado de cacau.","Misture, gele 20 min se estiver mole, enrole e passe no granulado."],
["Mousse de chocolate proteico","Sem forno","~25 g","1 banana; 2 col. de cacau; 1 scoop de whey; 2 col. de iogurte ou leite.","Bata tudo e leve à geladeira 15–20 min."],
["Banana caramelizada","Quentinho pós-treino","—","1 banana em rodelas; canela; 1 col. de pasta de amendoim.","Grelhe 2–3 min por lado, polvilhe canela e finalize com a pasta."],
["Cookie de aveia e banana","Rende várias unidades","—","2 bananas maduras; 1 ½ xícara de aveia; cacau e gotas 70% opcionais; canela.","Misture, modele e asse a 180 °C por 15–18 min."],
["Iogurte com cacau e frutas","Pronto em 2 min","~15 g","1 pote de iogurte; 1 col. chá de cacau; ½ xícara de frutas vermelhas.","Misture iogurte e cacau, frutas por cima."]]}
];

