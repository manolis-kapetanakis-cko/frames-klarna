var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");

Frames.init("pk_test_7d9921be-b71f-47fa-b996-29515831d911");




Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    onCardValidationChanged
);
function onCardValidationChanged(event) {
    console.log("CARD_VALIDATION_CHANGED: %o", event);

    var errorMessage = document.querySelector(".error-message");
    payButton.disabled = !Frames.isCardValid();
}

Frames.addEventHandler(
    Frames.Events.FRAME_VALIDATION_CHANGED,
    onValidationChanged
);
function onValidationChanged(event) {
    console.log("FRAME_VALIDATION_CHANGED: %o", event);

    var errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = getErrorMessage(event);
}

var errors = {};
errors["card-number"] = "Please enter a valid card number";
errors["expiry-date"] = "Please enter a valid expiry date";
errors["cvv"] = "Please enter a valid cvv code";

function getErrorMessage(event) {
    if (event.isValid || event.isEmpty) {
        return "";
    }

    return errors[event.element];
}

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, onCardTokenized);
function onCardTokenized(event) {
    var el = document.querySelector(".success-payment-message");
    $.post("/pay", {
        token: event.token,
    },
        function (data, status) {
            console.log(data);
            if (data.status === "Authorized") {
                $('.paymentwrapper').html(
                    `<div class='container' style='margin-top: 20px;'>
                    <h1>Thank you for your order</h1>
                    <p>Your order number is: <mark> ${data.reference} </mark></p></br>
                    <p>Total:  ${data.currency}  ` + data.amount / 100 + `</p>
                    <p>Cancel transaction <button onclick="postForRefund('${data.id}')">here</button></p>
                </div>
                `);
            } else {
                $('.paymentwrapper').html(
                    `<div class='container' style='margin-top: 20px;'>
                    <h1>Your payment has been ${data.status}</h1>
                    <p>Your order number is: <mark> ${data.reference} </mark></p></br>
                    <p>Please try again by clicking <a href='../'>here</a>.</p>
                </div>
                `);
            }
        });
}
function postForRefund(p_id) {
    $.post("/refund/" + p_id, {
    },
        function (data, status) {
            $('.paymentwrapper').html(
                `<div class='container' style='margin-top: 20px;'>
                    <h1>Payment canceled</h1>
                </div>
                `);
            location.reload();
        })
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    Frames.submitCard();
});


