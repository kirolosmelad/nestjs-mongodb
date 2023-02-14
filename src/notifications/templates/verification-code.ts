export const getVerificationCodeEmailSubject = 'Verify your email';

export const getVerificationCodeTemplate = (name: string, code: string) => {
  return `<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap"
        rel="stylesheet"
    />
    <style>
        *,
			*::before,
			*::after {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
				font-size: 1rem;
				font-family: "Poppins", sans-serif;
			}

			:root {
				--primary: #ff3c2e;
				--white: #fff;
				--black: #000000;
			}

			a {
				list-style: none;
				text-decoration: none;
				color: var(--white);
			}

			body {
				width: 100%;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
			}

			.text-center {
				text-align: center;
			}

			.text-black {
				color: var(--black);
			}

			.flex-center {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
			}

			.main {
				width: 100%;
				height: 100vh;
				background-color: var(--white);
				position: relative;
			}

			.main-box {
				width: 27.75rem;
				height: 33.375rem;
				border: 1px solid #e5e5e5;
				border-radius: 5px;
			}

			.image-logo {
				margin-top: 70px;
			}

			.title {
				width: 16.375rem;
				font-weight: 500;
				line-height: 36px;
				font-size: 1.5rem;
				margin-top: 15px;
			}

			.description {
				width: 22.875rem;
				font-weight: 400;
				font-size: 0.875rem;
				line-height: 179%;
				margin-top: 5px;
			}

			.code {
				margin-top: 66px;
			}

			.code > p {
				font-weight: 400;
				font-size: 0.75rem;
				line-height: 208%;
			}

			.code > p:last-child {
				font-weight: 900;
				font-size: 2rem;
				line-height: 78%;
				margin: 5px 0 0 0;
			}

			.buton-confirmation {
				background-color: var(--primary);
				border-radius: 9px;
				margin: 66px 0 0 0;
				padding: 19px 18px 18px 9px;
				font-weight: 600;
				font-size: 0.938rem;
				line-height: 14px;
        transition: ease 0.3s;
			}

            .buton-confirmation:hover {
                background-color: var(--black);
                
            }
    </style>
</head>
<body>
    <section class="main flex-center">
        <div class="main-box flex-center">

            <h3 class="title text-center">Welcome ${name} to Gebhaly</h3>
            <p class="description text-center">
                We are delighted that you have joined us and are excited for the
                what is to come.
            </p>

            <div class="code text-center">
                <p>Your confirmation code is the</p>
                <p>${code}</p>
            </div>
        </div>
    </section>
</body>`;
};
