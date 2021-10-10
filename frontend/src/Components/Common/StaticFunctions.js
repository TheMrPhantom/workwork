import Config from "../../environment.json";

export const doPostRequest = async (path, data) => {
    const resp = await fetch(Config.DOMAIN + path,
        {
            credentials: 'include',
            method: "POST",
            headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "/*" },
            body: JSON.stringify(data)
        });
    const status_code = resp.status
    if (status_code === 200) {
        const userJson = await resp.json();

        return { code: status_code, content: userJson }
    } else if (status_code === 403) {
        /*openSnackbar("Token invalid", "error")
        setloginToken("")*/
        return { code: status_code }
    } else {
        return { code: status_code }
    }
};

export const doGetRequest = async (path) => {
    const userInput = await fetch(Config.DOMAIN + path,
        {
            credentials: 'include',
            method: "GET",
            headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "*" },
        });

    const status_code = userInput.status

    if (status_code === 200) {
        const userJson = await userInput.json();
        return { code: status_code, content: userJson }
    } else if (status_code === 403) {
        /*if (loginToken !== "") {
            openSnackbar("Token invalid", "error")
            setloginToken("")
        }*/
        return { code: status_code }
    } else {
        return { code: status_code }
    }
};

export const getAndStore = (path, stateFunction) => {
    const getInfos = async () => {
        const req = await doGetRequest(path)

        if (req.code === 200) {
            stateFunction(req.content)
        }
    }
    getInfos()
};