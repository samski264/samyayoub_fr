"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CardElement, useStripe, useElements, ExpressCheckoutElement, AddressElement, LinkAuthenticationElement } from "@stripe/react-stripe-js";
import Spinner from "@components/Spinner";
import { useRouter } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";
import SHA256 from "crypto-js/sha256"


function CheckoutForm({ clientSecret, price, object }) {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const eventTriggered = useRef(false);
  

  // const clientSecret = props.clientSecret; // Utilisez celui passé par le parent

  const handlePaymentSuccess = useCallback(
    async (paymentIntent) => {
      // console.log("Paiement réussi:", paymentIntent);
      // console.log(buyerInfo);
      // console.log(email);
      sendGTMEvent({
        event: "purchase",
        value: object.price,
        currency: "EUR",
        transaction_id: paymentIntent.id,
        user_data: {
          email_address: hash(email),
          phone_number: hash(buyerInfo.phone),
          address: {
            first_name: hash(buyerInfo.name),
            last_name: hash(buyerInfo.name),
            city: hash(buyerInfo.address.city),
            country: hash(buyerInfo.address.country),
            postal_code: hash(buyerInfo.address.postal_code),
          },
        },
        items: [
          {
            item_id: object._id,
            item_name: object.objectName,
          },
        ],
        "x-fb-ud-external_id": localStorage.getItem("logsId"),
        external_id: localStorage.getItem("logsId"),
      });
      const response = await fetch(process.env.NEXT_PUBLIC_API_URI + "/api/transaction/buyed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          paymentIntent: paymentIntent,
          email: email,
          buyerInfo: buyerInfo,
          object: object._id,
        }),
      });

      if (response.ok) {
        // console.log("ok");
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        router.push("/thanks");

        //next router redirect
      }

      //here send api payment confirmation
    },
    [buyerInfo, email]
  );

  const onConfirm = async () => {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    // Assurez-vous de ne pas tenter de logger une variable inexistante
    console.log(paymentIntent);

    if (error) {
      // Ce bloc est exécuté uniquement s'il y a une erreur immédiate lors de la confirmation du paiement.
      // Affichez l'erreur à votre client (par exemple, paiement incomplet).
      setError(error.message);
    } else {
      console.log("done");

      sendGTMEvent({
        event: "purchase",
        value: object.price,
        currency: "EUR",
        transaction_id: paymentIntent.id,
        user_data: {
          email_address: hash(email),
          phone_number: hash(buyerInfo.phone),
          address: {
            first_name: hash(buyerInfo.name),
            last_name: hash(buyerInfo.name),
            city: hash(buyerInfo.address.city),
            country: hash(buyerInfo.address.country),
            postal_code: hash(buyerInfo.address.postal_code),
          },
        },
        items: [
          {
            item_id: object._id,
            item_name: object.objectName,
          },
        ],
        "x-fb-ud-external_id": localStorage.getItem("logsId"),
        external_id: localStorage.getItem("logsId"),
      });

      const response = await fetch(process.env.NEXT_PUBLIC_API_URI + "/api/transaction/buyed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          paymentIntent: paymentIntent,
          email: email,
          buyerInfo: buyerInfo,
          object: object._id,
        }),
      });

      if (response.ok) {
        console.log("ok");
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        router.push("/thanks");
        // Redirection ou autre traitement post-paiement
      }
    }
  };

  const handlePaymentError = useCallback((error) => {
    console.error("Échec du paiement:", error);
    setError(error.message);
    setProcessing(false);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!stripe || !elements || !buyerInfo || !clientSecret) return;

      setProcessing(true);

      try {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: buyerInfo.name,
              phone: buyerInfo.phone,
              email: email,
              address: buyerInfo.address,
            },
          },
          shipping: {
            name: buyerInfo.name,
            phone: buyerInfo.phone,
            address: buyerInfo.address,
          },
        });

        if (result.error) {
          handlePaymentError(result.error);
        } else {
          handlePaymentSuccess(result.paymentIntent);
        }
      } catch (error) {
        handlePaymentError(error);
      }
    },
    [stripe, elements, buyerInfo, clientSecret, handlePaymentSuccess, handlePaymentError]
  );

  // const onConfirm = useCallback(
  //   async (result) => {

  //     if (result.error) {
  //       handlePaymentError(result.error);
  //     } else {
  //       handlePaymentSuccess(result.paymentIntent);
  //     }
  //   },
  //   [handlePaymentSuccess, handlePaymentError]
  // );

  const cardElementOptions = {
    style: {
      base: {
        colorPrimary: "#B1B1B1",
        colorBackground: "rgba(255, 255, 255, 0.2)",
        colorText: "#000",
        colorTextSecondary: "#B1B1B1",
        colorTextPlaceholder: "#B1B1B1  ",
        fontSize: "14px",
        colorDanger: "#df1b41",
        fontFamily: "randRegular, Ideal Sans, system-ui, sans-serif",
        spacingUnit: "2px",
        fontSize: "14px",
        paddingLeft: "20px",
        "::placeholder": {
          color: "#B1B1B1",
        },
      },
      invalid: {
        color: "#df1b41",
        iconColor: "#df1b41",
      },
    },
  };

  const addressElementOptions = useMemo(
    () => ({
      mode: "shipping",
      allowedCountries: ["FR"],
      fields: {
        phone: "always",
      },
      validation: {
        phone: {
          required: "always",
        },
      },
    }),
    []
  );
  function hash(value) {
    if (!value) return "";
    const cleaned = value.replace(/^\+/, "").trim().toLowerCase();
    return SHA256(cleaned).toString();
  }
  useEffect(() => {
    if (buyerInfo && buyerInfo.name && buyerInfo.phone && buyerInfo.address) {
      setShowPaymentMethods(true);
    } else {
      setShowPaymentMethods(false);
    }
  }, [buyerInfo]);

  if (loading) return <Spinner color={"white"} />;

  return (
    <>
      <div className="addressElementContainer">
        <h3>Email</h3>
        <LinkAuthenticationElement
          onChange={(event) => {
            if (event.complete) {
              console.log(event);
              setEmail(event.value.email);
            }
          }}
        />
      </div>
      <div className="addressElementContainer">
        <h3>Livraison</h3>
        {email && (
          <AddressElement
            options={addressElementOptions}
            onChange={(event) => {
              if (event.complete) {
                console.log("Address event:", event);
                console.log(hash(email))

             
                setBuyerInfo(event.value);
                console.log(event.value.address )
                sendGTMEvent({  
                  event: "add_shipping_info",
                  value: object.price,
                  currency: "EUR",
                  user_data: {
                    email_address: hash(email),
                    phone_number: hash(event.value.phone),
                    address: {
                      first_name: hash(event.value.name),
                      last_name: hash(event.value.name),
                      city: hash(event.value.address.city),
                      country: hash(event.value.address.country),
                      postal_code: hash(event.value.address.postal_code), 
                    },
                  },
                  items: [
                    {
                      item_id: object._id,
                      item_name: object.objectName,
                    },
                  ],

                  "x-fb-ud-external_id": localStorage.getItem("logsId"),
                  external_id: localStorage.getItem("logsId"),
                });
              }
            }}
          />
        )}
      </div>
      <div className="paymentMethodsContainer">
        <h3>Paiement</h3>
        {showPaymentMethods && (
          <>
            {clientSecret && (
              <ExpressCheckoutElement
                options={{
                  clientSecret,
                  // emailRequired: true,
                  // phoneNumberRequired: true,
                  // shippingAddressRequired: true,
                  // paymentMethods: { applePay: "always" },
                  // buttonType: {
                  //   applePay: "buy",
                  //   googlePay: "buy",
                  //   paypal: "buynow",
                  //   klarna: "pay",
                  // },
                }}
                onConfirm={onConfirm}

                // onConfirm={onConfirm}
              />
            )}

            <form onSubmit={handleSubmit}>
              <div className="cardElementContainer">
                <CardElement
                  onChange={(event) => {
                    if (!eventTriggered.current) {
                      sendGTMEvent({
                        event: "add_payment_info",
                        value: object.price,
                        currency: "EUR",
                        user_data: {
                          email_address: hash(email),
                          phone_number: hash(buyerInfo.phone),
                          address: {
                            first_name: hash(buyerInfo.name),
                            last_name: hash(buyerInfo.name),
                            city: hash(buyerInfo.address.city),
                            country: hash(buyerInfo.address.country),
                            postal_code: hash(buyerInfo.address.postal_code),
                          },
                        },
                        items: [
                          {
                            item_id: object._id,
                            item_name: object.objectName,
                          },
                        ],
                        "x-fb-ud-external_id": localStorage.getItem("logsId"),
                        external_id: localStorage.getItem("logsId"),
                      });
                      // On marque l'événement comme déclenché
                      eventTriggered.current = true;
                    }
                  }}
                  options={cardElementOptions}
                />
              </div>

              {error && <div style={{ color: "red" }}>{error}</div>}
              {succeeded && <div style={{ color: "green" }}>Paiement réussi!</div>}

              <button className="payButton" type="submit" disabled={!stripe || !buyerInfo || processing || succeeded}>
                {processing ? "Traitement..." : "Payer " + (price + 4.99).toFixed(2) + "€ par carte"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default CheckoutForm;
