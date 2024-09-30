// script.js
document.getElementById('payment-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previene el envío normal del formulario

    // Obtener los valores del formulario
    const cardDetails = {
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        expiryMonth: document.getElementById('expiryMonth').value,
        expiryYear: document.getElementById('expiryYear').value,
        cvv: document.getElementById('cvv').value,
        amount: parseFloat(document.getElementById('amount').value)
    };

    // Muestra mensaje de "Procesando..."
    const responseMessage = document.getElementById('response-message');
    responseMessage.textContent = 'Procesando el pago...';
    responseMessage.classList.remove('hidden', 'error', 'success');

    try {
        // Obtener el token
        const token = await getToken(cardDetails);
        console.log("Token obtenido:", token);

        // Realizar el cargo
        const chargeDetails = {
            token: token,
            amount: {
                subtotalIva: 0,
                subtotalIva0: cardDetails.amount,
                ice: 0,
                iva: 0,
                currency: "COP"
            },
            months: 3,
            metadata: {
                referencia: "987654"
            },
            contactDetails: {
                documentType: "CC",
                documentNumber: "1234567890",
                email: "user@example.com",
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "+593912345678"
            },
            orderDetails: {
                siteDomain: "example.com",
                shippingDetails: {
                    name: "John Doe",
                    phone: "+593912345678",
                    address: "Eloy Alfaro 139 y Catalina Aldaz",
                    city: "Cartagena",
                    region: "Bolivar",
                    country: "Colombia"
                },
                billingDetails: {
                    name: "John Doe",
                    phone: "+593912345678",
                    address1: "Eloy Alfaro 139 y Catalina Aldaz",
                    address2: "Eloy Alfaro 139 y Catalina Aldaz",
                    city: "Cartagena",
                    region: "Bolivar",
                    country: "Colombia"
                }
            },
            productDetails: {
                product: [
                    {
                        id: "198952AB",
                        title: "eBook Digital Services",
                        price: 15000,
                        sku: "10101042",
                        quantity: 1
                    },
                    {
                        id: "198953AB",
                        title: "eBook Virtual Selling",
                        price: 15000,
                        sku: "004834GQ",
                        quantity: 1
                    }
                ]
            },
            fullResponse: "v2"
        };

        const chargeResponse = await makeCharge(chargeDetails);
        console.log("Respuesta del cargo:", chargeResponse);

        // Si el cargo fue exitoso
        responseMessage.textContent = "Pago aprobado con éxito.";
        responseMessage.classList.add('success');
    } catch (error) {
        console.error("Error:", error);

        // Si ocurrió un error
        responseMessage.textContent = "Pago rechazado o error en la solicitud.";
        responseMessage.classList.add('error');
    }
});

// Función para obtener el token
async function getToken(cardDetails) {
    const data = JSON.stringify({
        card: {
            name: cardDetails.name,
            number: cardDetails.number,
            expiryMonth: cardDetails.expiryMonth,
            expiryYear: cardDetails.expiryYear,
            cvv: cardDetails.cvv
        },
        totalAmount: cardDetails.amount,
        currency: "COP"
    });

    const config = {
        method: 'post',
        url: 'https://api-uat.kushkipagos.com/card/v1/tokens',
        headers: { 
            'Public-Merchant-Id': '001f21b3e4724f83b466eb995b3c6188', 
            'Content-Type': 'application/json'
        },
        data: data
    };

    const response = await axios.request(config);
    return response.data.token; // Devolver el token obtenido
}

// Función para realizar el cargo
async function makeCharge(chargeDetails) {
    const data = JSON.stringify(chargeDetails);

    const config = {
        method: 'post',
        url: 'https://api-uat.kushkipagos.com/card/v1/charges',
        headers: { 
            'Content-Type': 'application/json', 
            'Private-Merchant-Id': 'deae491d374c47a487db80343e8f2f53'
        },
        data: data
    };

    const response = await axios.request(config);
    return response.data; // Devolver la respuesta del cargo
}
