IHG - Formatura do 9o Ano
=========================
Abra o index.html no navegador (precisa de internet: Three.js e fontes vem de CDN).
Para rodar local com servidor:  python3 -m http.server  e acesse http://localhost:8000

ARQUIVOS
index.html      estrutura e conteudo
css/style.css   todo o visual (cores em :root)
js/ui-3d.js     abertura, textos animados, cursor e pulseiras 3D (Three.js)
js/app.js       CONFIG (data do evento, gateway PIX), ingressos, compra, PIX demo, ingresso digital, contagem, FAQ

AJUSTES RAPIDOS (js/app.js, topo)
EVENT_DATE      data/hora do evento (hoje: 2026-12-17T20:00:00-03:00)
GATEWAY_URL     null = modo demonstracao. Para PIX real, aponte para seu servidor com
                POST /create  -> {id, copyPaste, expiresIn}
                GET  /status?id=  -> {status:"paid"|"pending"|"expired"}
                O webhook do gateway deve ficar no SEU servidor. Nunca coloque chaves no frontend.
TK              nomes, precos e cores das pulseiras

DEMONSTRACAO
QR Code e codigo PIX sao ilustrativos (nao pagaveis). Remova o botao "Simular confirmacao (demo)" em pay() antes de lancar.
Fotos: troque os blocos .ph em index.html por <img src="..." loading="lazy">.
