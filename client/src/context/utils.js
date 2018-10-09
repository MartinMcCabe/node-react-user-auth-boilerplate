

async function doFetch(q) {
    try{
        const res = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(q)
        })
        const data = await res.json()
        if(data.errors) {
            console.log(">>", data)
            // handle errors, disply to the user
            console.error(data.errors)
        }
        return data
    }catch (e){
        // TODO Add sentry logger here
        console.error(e)
    }
}

export {doFetch}