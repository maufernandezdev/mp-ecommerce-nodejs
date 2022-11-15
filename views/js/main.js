document.querySelector("checkout-btn").addEventListener("click", async () => {
  
    // $('#checkout-btn').attr("disabled", true);    
    const orderData = {
        title: document.querySelector("#title").value,
        quantity: document.querySelector("#quantity").value,
        price: document.querySelector("#unit-price").value,
        picture_url:  document.querySelector("#picture_url").value
    };
    
    try
    {   
        const response = await fetch('http://mau-mp-ecommerce-nodejs.herokuapp.com/checkout' , {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData)});
        const data = await response.json();
        window.location.href = data.init_point;
    }
    catch(e)
    {
        console.log("error:" , e);
        // $('#checkout-btn').attr("disabled", false);
    }

  });