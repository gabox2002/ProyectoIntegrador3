import { MercadoPagoConfig, Preference } from 'mercadopago';

export const createCheckoutPreference = async (req, res) => {
    const {body} = req;
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preference = new Preference(client);
        console.log(body)
        const response = await preference.create({
            body: {
                ...body,
                back_urls: {
                    success: `${process.env.FRONT_URL}/checkout/success`
                } 
            }})
        res.json({
            ok: true,
            preferenceId: response.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Error con el servidor")
    }
}