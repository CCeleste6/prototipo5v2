const VANTAGENS = {
  Precursores: {
    1: [
      { id:"pre-1-1", nome:"Chama da Liderança I", bonus:3, desc:"Representa a casa em atividade coletiva → +3 PC." },
      { id:"pre-1-2", nome:"Voz da Inspiração I", bonus:5, desc:"Convida colega novo para atividade → +5 PC." },
      { id:"pre-1-3", nome:"Força da Determinação I", bonus:7, desc:"Conclui atividade após falhar antes → +7 PC." }
    ],
    2: [
      { id:"pre-2-1", nome:"Chama da Liderança II", bonus:6, desc:"Ajuda outro representante → +6 PC." },
      { id:"pre-2-2", nome:"Voz da Inspiração II", bonus:7, desc:"Motiva 3 colegas a participar → +7 PC." },
      { id:"pre-2-3", nome:"Força da Determinação II", bonus:12, desc:"Participa após 2 falhas anteriores → +12 PC." }
    ],
    3: [
      { id:"pre-3-1", nome:"Chama da Liderança III", bonus:10, desc:"Motiva mais de 3 alunos a representarem → +10 PC." },
      { id:"pre-3-2", nome:"Voz da Inspiração III", bonus:13, desc:"Incentiva 5+ colegas → +13 PC." },
      { id:"pre-3-3", nome:"Força da Determinação III", bonus:16, desc:"Supera dificuldades e conclui semanalmente → +16 PC." }
    ],
    4: [
      { id:"pre-4-1", nome:"Bandeira da Coragem I", bonus:15, desc:"Lidera atividade inédita → +15 PC." },
      { id:"pre-4-2", nome:"Rastro do Pioneiro I", bonus:18, desc:"Cria atividade de impacto com 3 colegas → +18 PC." },
      { id:"pre-4-3", nome:"Marca Individual I", bonus:20, desc:"Conclusão perfeita individual → +20 PC." }
    ],
    5: [
      { id:"pre-5-1", nome:"Bandeira da Coragem II", bonus:22, desc:"Organiza atividade com grupo inteiro → +22 PC." },
      { id:"pre-5-2", nome:"Rastro do Pioneiro II", bonus:25, desc:"Cria nova solução adotada pela casa → +25 PC." },
      { id:"pre-5-3", nome:"Marca Individual II", bonus:28, desc:"Entrega extra além do mínimo obrigatório → +28 PC." }
    ],
    6: [
      { id:"pre-6-1", nome:"Bandeira da Coragem III", bonus:30, desc:"Mobiliza 5 alunos para atividade extra → +30 PC." },
      { id:"pre-6-2", nome:"Rastro do Pioneiro III", bonus:35, desc:"Casa inteira adota iniciativa → +35 PC." },
      { id:"pre-6-3", nome:"Marca Individual III", bonus:50, desc:"Semana perfeita com destaque máximo → +50 PC." }
    ],
    7: [
      { id:"pre-7-1", nome:"Estandarte Vivo", bonus:60, desc:"Primeira casa a completar semana → +60 PC." },
      { id:"pre-7-2", nome:"Chama Inquebrável", bonus:80, desc:"Aluno supera histórico negativo e conclui mês perfeito → +80 PC." },
      { id:"pre-7-3", nome:"Rastro Inspirador", type:"multiplicador", multiplier:2, bonus:0, desc:"Casa segue iniciativa do aluno → PC dobrado." }
    ],
    8: [
      { id:"pre-8-1", nome:"Pioneiro Supremo", bonus:100, desc:"Casa entrega projeto inédito primeiro → +100 PC." },
      { id:"pre-8-2", nome:"Força Solitária", bonus:120, desc:"Aluno entrega excelência por 2 semanas seguidas → +120 PC." },
      { id:"pre-8-3", nome:"Legado em Movimento", type:"multiplicador", multiplier:3, bonus:0, desc:"70% da casa segue atividade extra → PC triplicado." }
    ],
    9: [
      { id:"pre-9-1", nome:"Vanguarda Absoluta", bonus:150, desc:"Casa completa a semana antes de todas → +150 PC." },
      { id:"pre-9-2", nome:"Rota do Destemido", bonus:300, desc:"Aluno lidera projeto complexo até o final → +300 PC." },
      { id:"pre-9-3", nome:"Legado Audaz", bonus:250, desc:"Casa propõe e realiza projeto inédito → +250 PC." }
    ],
    10: [
      { id:"pre-10-1", nome:"Ecos da Liderança", bonus:750, desc:"Aluno lidera projeto interescolar → +750 PC." },
      { id:"pre-10-2", nome:"Legado dos Destemidos", type:"multiplicador", multiplier:5, bonus:0, desc:"Casa inteira participa → PC multiplicado por 5." },
      { id:"pre-10-3", nome:"Marca Imortal", bonus:500, desc:"Aluno conquista feito máximo externo → +500 PC." }
    ]
  },

  Visionários: {
    1: [
      { id:"vis-1-1", nome:"Faísca Criativa I", bonus:3, desc:"Criação original → +3 PC." },
      { id:"vis-1-2", nome:"Ousadia Inicial I", bonus:5, desc:"Ideia não convencional adotada → +5 PC." },
      { id:"vis-1-3", nome:"Inspiração Compartilhada I", bonus:7, desc:"Sugestão útil para 2 colegas → +7 PC." }
    ],
    2: [
      { id:"vis-2-1", nome:"Faísca Criativa II", bonus:6, desc:"2 ideias originais na mesma atividade → +6 PC." },
      { id:"vis-2-2", nome:"Ousadia Inicial II", bonus:15, desc:"Resposta ousada perfeita → +15 PC." },
      { id:"vis-2-3", nome:"Inspiração Compartilhada II", bonus:10, desc:"Ajuda 3 colegas → +10 PC." }
    ],
    3: [
      { id:"vis-3-1", nome:"Faísca Criativa III", bonus:9, desc:"3 criações bem avaliadas → +9 PC." },
      { id:"vis-3-2", nome:"Ousadia Inicial III", bonus:25, desc:"Ideia com impacto relevante → +25 PC." },
      { id:"vis-3-3", nome:"Inspiração Compartilhada III", bonus:15, desc:"Aplicada por 4 colegas → +15 PC." }
    ],
    4: [
      { id:"vis-4-1", nome:"Laboratório Vivo I", bonus:20, desc:"Ideia vira experimento oficial → +20 PC." },
      { id:"vis-4-2", nome:"Centelha Coletiva I", bonus:18, desc:"Grupo cria solução inovadora → +18 PC." },
      { id:"vis-4-3", nome:"Ousadia Reconhecida I", bonus:20, desc:"Abordagem fora do padrão → +20 PC." }
    ],
    5: [
      { id:"vis-5-1", nome:"Laboratório Vivo II", bonus:22, desc:"Dupla aprimora projeto → +22 PC." },
      { id:"vis-5-2", nome:"Centelha Coletiva II", bonus:25, desc:"4 colegas aplicam a ideia → +25 PC." },
      { id:"vis-5-3", nome:"Ousadia Reconhecida II", bonus:28, desc:"Protótipo apresentado → +28 PC." }
    ],
    6: [
      { id:"vis-6-1", nome:"Laboratório Vivo III", bonus:80, desc:"Piloto adotado pela escola → +80 PC." },
      { id:"vis-6-2", nome:"Centelha Coletiva III", bonus:35, desc:"50% da casa usa a ideia → +35 PC." },
      { id:"vis-6-3", nome:"Ousadia Reconhecida III", bonus:50, desc:"Proposta ousada eficaz → +50 PC." }
    ],
    7: [
      { id:"vis-7-1", nome:"Oficina de Possibilidades", bonus:60, desc:"Dinâmica inédita aplicada → +60 PC." },
      { id:"vis-7-2", nome:"Catalisador de Mudanças", bonus:80, desc:"Regras alteradas por iniciativa → +80 PC." },
      { id:"vis-7-3", nome:"Faísca Contagiante", type:"multiplicador", multiplier:2, bonus:0, desc:"Ideia replicada em massa → PC dobrado." }
    ],
    8: [
      { id:"vis-8-1", nome:"Laboratório Aberto", bonus:100, desc:"Casa inteira envolvida → +100 PC." },
      { id:"vis-8-2", nome:"Inventor Solitário", bonus:180, desc:"Aluno cria solução inédita e validada → +180 PC." },
      { id:"vis-8-3", nome:"Festival de Ideias", type:"multiplicador", multiplier:3, bonus:0, desc:"70% da casa participa → PC triplicado." }
    ],
    9: [
      { id:"vis-9-1", nome:"Visão que Ecoa", bonus:250, desc:"Projeto vira referência escolar → +250 PC." },
      { id:"vis-9-2", nome:"Mente Brilhante", bonus:350, desc:"Aluno recebe reconhecimento formal → +350 PC." },
      { id:"vis-9-3", nome:"Impacto Coletivo", type:"multiplicador", multiplier:4, bonus:0, desc:"80% da casa em projeto externo → PC quadruplicado." }
    ],
    10: [
      { id:"vis-10-1", nome:"Manifesto Criativo", bonus:500, desc:"Proposta entra no planejamento escolar → +500 PC." },
      { id:"vis-10-2", nome:"Horizonte Infinito", type:"multiplicador", multiplier:5, bonus:0, desc:"Projeto que influencia outra escola → PC x5." },
      { id:"vis-10-3", nome:"Gênio Visionário", bonus:800, desc:"Aluno obtém reconhecimento internacional/local importante → +800 PC." }
    ]
  },

  Guardiões: {
    1: [
      { id:"gua-1-1", nome:"Escudo da Disciplina I", bonus:3, desc:"Entrega tudo no prazo → +3 PC." },
      { id:"gua-1-2", nome:"Responsabilidade Compartilhada I", bonus:5, desc:"Alunos ajudam outros a não perder prazo → +5 PC." },
      { id:"gua-1-3", nome:"Defesa Coletiva I", bonus:7, desc:"Casa passa semana sem penalidade → +7 PC." }
    ],
    2: [
      { id:"gua-2-1", nome:"Escudo da Disciplina II", bonus:6, desc:"2 semanas sem atraso → +6 PC." },
      { id:"gua-2-2", nome:"Responsabilidade Compartilhada II", bonus:9, desc:"4+ alunos sem atraso → +9 PC." },
      { id:"gua-2-3", nome:"Defesa Coletiva II", bonus:12, desc:"Casa passa 2 semanas impecável → +12 PC." }
    ],
    3: [
      { id:"gua-3-1", nome:"Escudo da Disciplina III", bonus:9, desc:"3 semanas sem atraso → +9 PC." },
      { id:"gua-3-2", nome:"Responsabilidade Compartilhada III", bonus:13, desc:"5 alunos sem falhas → +13 PC." },
      { id:"gua-3-3", nome:"Defesa Coletiva III", bonus:16, desc:"Casa passa 3 semanas impecável → +16 PC." }
    ],
    4: [
      { id:"gua-4-1", nome:"Código da Honra I", bonus:12, desc:"Todos entregam no prazo → +12 PC." },
      { id:"gua-4-2", nome:"Vigilância Coletiva I", bonus:16, desc:"Metade da casa sem falhas → +16 PC." },
      { id:"gua-4-3", nome:"Proteção Constante I", bonus:20, desc:"2 semanas perfeitas coletivas → +20 PC." }
    ],
    5: [
      { id:"gua-5-1", nome:"Código da Honra II", bonus:15, desc:"70% entregam no prazo → +15 PC." },
      { id:"gua-5-2", nome:"Vigilância Coletiva II", bonus:20, desc:"60% sem falhas → +20 PC." },
      { id:"gua-5-3", nome:"Proteção Constante II", bonus:25, desc:"Casa passa 3 semanas impecável → +25 PC." }
    ],
    6: [
      { id:"gua-6-1", nome:"Código da Honra III", bonus:18, desc:"80% entregam no prazo → +18 PC." },
      { id:"gua-6-2", nome:"Vigilância Coletiva III", bonus:24, desc:"70% sem falhas → +24 PC." },
      { id:"gua-6-3", nome:"Proteção Constante III", bonus:30, desc:"Casa passa 4 semanas perfeitas → +30 PC." }
    ],
    7: [
      { id:"gua-7-1", nome:"Juramento de Aço", bonus:60, desc:"Toda turma entrega no prazo → +60 PC." },
      { id:"gua-7-2", nome:"Fortaleza Impecável", bonus:100, desc:"Casa passa 5 semanas perfeitas → +100 PC." },
      { id:"gua-7-3", nome:"Olhos da Vigília", type:"multiplicador", multiplier:2, bonus:0, desc:">=70% participa de todas as atividades → PC dobrado." }
    ],
    8: [
      { id:"gua-8-1", nome:"Comando da Ordem", bonus:80, desc:"Todos líderes entregam → +80 PC." },
      { id:"gua-8-2", nome:"Ritual da Pontualidade", bonus:90, desc:"70% entrega no primeiro dia → +90 PC." },
      { id:"gua-8-3", nome:"Disciplina Contagiante", type:"multiplicador", multiplier:3, bonus:0, desc:"80% da casa em todas atividades → PC triplicado." }
    ],
    9: [
      { id:"gua-9-1", nome:"Guardião Supremo", bonus:150, desc:"Casa completa mês sem falhas → +150 PC." },
      { id:"gua-9-2", nome:"Sentinela Eterna", bonus:200, desc:"Casa passa 2 meses perfeita → +200 PC." },
      { id:"gua-9-3", nome:"Linha Intransponível", type:"multiplicador", multiplier:4, bonus:0, desc:"90% da casa participa → PC quadruplicado." }
    ],
    10: [
      { id:"gua-10-1", nome:"Estandarte da Ordem", type:"multiplicador", multiplier:2, bonus:0, desc:"Temporada inteira sem penalidades → PC x2." },
      { id:"gua-10-2", nome:"Legião Inabalável", bonus:300, desc:"100% participa de pelo menos 1 atividade → +300 PC." },
      { id:"gua-10-3", nome:"Coluna da Disciplina", bonus:500, desc:"80% por 3 meses → +500 PC." }
    ]
  },

  Solidários: {
    1: [
      { id:"sol-1-1", nome:"Apoio Moral I", bonus:2, desc:"Aluno participa de atividade coletiva pela primeira vez → +2 PC." },
      { id:"sol-1-2", nome:"Força do Grupo I", bonus:3, desc:"2 membros participam juntos → +3 PC." },
      { id:"sol-1-3", nome:"Cuidado Contínuo I", bonus:1, desc:"Casa recebe +1 PC por atividade completa." }
    ],
    2: [
      { id:"sol-2-1", nome:"Apoio Moral II", bonus:3, desc:"Aluno traz colega novo → +3 PC." },
      { id:"sol-2-2", nome:"Força do Grupo II", bonus:5, desc:"3 membros juntos → +5 PC." },
      { id:"sol-2-3", nome:"Cuidado Contínuo II", bonus:8, desc:"Turma completa tarefas da semana → +8 PC." }
    ],
    3: [
      { id:"sol-3-1", nome:"Apoio Moral III", bonus:5, desc:"2 alunos novos participam juntos → +5 PC." },
      { id:"sol-3-2", nome:"Força do Grupo III", bonus:8, desc:"4 membros juntos → +8 PC." },
      { id:"sol-3-3", nome:"Cuidado Contínuo III", bonus:12, desc:"Turma completa tarefas c/ 80% acertos → +12 PC." }
    ],
    4: [
      { id:"sol-4-1", nome:"Voz Unida I", bonus:6, desc:"3 alunos incentivam colega a participar → +6 PC." },
      { id:"sol-4-2", nome:"União Inquebrável I", bonus:10, desc:"5+ membros juntos → +10 PC." },
      { id:"sol-4-3", nome:"Raízes Fortes I", bonus:15, desc:"Turma conclui semana perfeita → +15 PC." }
    ],
    5: [
      { id:"sol-5-1", nome:"Voz Unida II", bonus:8, desc:"4 alunos diferentes juntos → +8 PC." },
      { id:"sol-5-2", nome:"União Inquebrável II", bonus:12, desc:"6+ juntos → +12 PC." },
      { id:"sol-5-3", nome:"Raízes Fortes II", bonus:18, desc:"Semana com 90% acertos → +18 PC." }
    ],
    6: [
      { id:"sol-6-1", nome:"Voz Unida III", bonus:10, desc:"5 alunos diferentes juntos → +10 PC." },
      { id:"sol-6-2", nome:"União Inquebrável III", bonus:15, desc:"7+ juntos → +15 PC." },
      { id:"sol-6-3", nome:"Raízes Fortes III", bonus:20, desc:"Semana com 100% conclusão → +20 PC." }
    ],
    7: [
      { id:"sol-7-1", nome:"Harmonia Plena", bonus:25, desc:"Metade +1 participa → +25 PC." },
      { id:"sol-7-2", nome:"Força Lendária", type:"multiplicador", multiplier:2, bonus:0, desc:"10+ membros juntos → PC dobrado." },
      { id:"sol-7-3", nome:"Árvore da Vida", bonus:50, desc:"Mês inteiro sem perder tarefas → +50 PC." }
    ],
    8: [
      { id:"sol-8-1", nome:"Círculo Inquebrável", bonus:40, desc:"Todos participam → +40 PC." },
      { id:"sol-8-2", nome:"Legado Vivo", bonus:100, desc:"3 semanas seguidas 100% conclusão → +100 PC." },
      { id:"sol-8-3", nome:"Eco Solidário", bonus:30, desc:"2 atividades com metade da casa → +30 PC." }
    ],
    9: [
      { id:"sol-9-1", nome:"Eterna Colheita", bonus:150, desc:"2 meses seguidos 100% conclusão → +150 PC." },
      { id:"sol-9-2", nome:"Força Transcendente", type:"multiplicador", multiplier:4, bonus:0, desc:"3 atividades com 8 membros → PC quadruplicado." },
      { id:"sol-9-3", nome:"Aliança Perfeita", bonus:60, desc:"Todos participam e sem falhas → +60 PC." }
    ],
    10: [
      { id:"sol-10-1", nome:"Coroa da União", type:"multiplicador", multiplier:3, bonus:0, desc:"100% participação → PC triplicado." },
      { id:"sol-10-2", nome:"Pulso Coletivo", bonus:150, desc:"75% participação em todas atividades do mês → +150 PC." },
      { id:"sol-10-3", nome:"Coração Único", bonus:500, desc:"Casa completa temporada sem falhar → +500 PC." }
    ]
  }
};
