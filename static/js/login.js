const urlBase = "https://edusp-api.ip.tv/";

async function login(event) {
    event.preventDefault();

    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    if (user.length !== 0 && pass.length !== 0) {

        const dados = {
            user: user,  // Use 'user' pois é o campo que o backend espera
            senha: pass
        };

        try {
            const response = await fetch('https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken', {
                method: 'POST',
                headers: {
                    'Referer': 'https://saladofuturo.educacao.sp.gov.br/',
                    'sec-ch-ua': '"Not) A; Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                    'sec-ch-ua-mobile': '?0',
                    'Request-Id': '|3773576706de4234b962b9cf1bf24421.b22143a9845041ef',
                    'traceparent': '00-3773576706de4234b962b9cf1bf24421-b22143a9845041ef-01',
                    'Ocp-Apim-Subscription-Key': '2b03c1db3884488795f79c37c069381a',
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
                },
                body: JSON.stringify(dados)
            });

            const data = await response.json();
            console.log('Resposta:', data);

            // Agora você pode chamar o getAuthToken com await sem problemas:
            const token = data.token; // ajuste para pegar o campo certo da resposta
            const authToken = await getAuthToken(token);

            if (authToken) {
                console.log('Login realizado com sucesso!');

                localStorage.setItem('token', authToken.auth_token);

                // Logo depois de pegar o authToken:
                await fetch('http://192.168.0.222:5000/set-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ token: authToken.auth_token }) // ⚡ Atenção aqui!
                });
                console.log('Token que vai pro /set-token:', authToken.auth_token);

                // Redireciona pra página protegida
                window.location.href = '/home';

            }
            else {
                console.error('Falha no login.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }

    } else {
        console.log('Preencha todos os campos!');
    }
}


async function getAuthToken(token) {
    const payload = {
        token: token
    };

    const response = await fetch(`${urlBase}/registration/edusp/token`, {
        method: 'POST',
        headers: {
            'x-api-realm': 'edusp',
            'x-api-platform': 'webclient',
            'sec-ch-ua-platform': '"Windows"',
            'Referer': 'https://saladofuturo.educacao.sp.gov.br/',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'request-id': '|3773576706de4234b962b9cf1bf24421.1825b03c208e44dd',
            'traceparent': '00-3773576706de4234b962b9cf1bf24421-1825b03c208e44dd-01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error('Erro na requisição:', response.status, response.statusText);
        return null; // Retorna algo para evitar undefined
    }

    const data = await response.json();
    console.log('Resposta da API:', data);

    return data; // 🔥 Isso faz a função retornar o JSON
}





// 1090963014sp
// Kk153264897!