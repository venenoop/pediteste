document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItemsList = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout-button");
  const checkoutTotalPrice = document.getElementById("checkout-total-price");
  const placeOrderButton = document.getElementById("place-order-button");

  const itemsInCart = [];

  const updateCartButtons = () => {
    addToCartButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        addToCart(index);
      });
    });
  };

  const addToCart = (index) => {
    itemsInCart.push(index);
    updateCartDisplay();
  };

  const removeFromCart = (index) => {
    const itemIndex = itemsInCart.indexOf(index);
    if (itemIndex !== -1) {
      itemsInCart.splice(itemIndex, 1);
      updateCartDisplay();
    }
  };

  const updateCartDisplay = () => {
    cartItemsList.innerHTML = "";
    let total = 0;
    itemsInCart.forEach((itemIndex) => {
      const brownie = document.querySelectorAll(".brownie")[itemIndex];
      const brownieTitle = brownie.querySelector("h2").textContent;
      const browniePrice = parseFloat(brownie.querySelector(".price").textContent.slice(1));
      total += browniePrice;
      const li = document.createElement("li");
      li.textContent = `${brownieTitle} - $${browniePrice.toFixed(2)}`;
      
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.className = "remove-from-cart-item";
      removeButton.addEventListener("click", () => {
        removeFromCart(itemIndex);
      });
      
      li.appendChild(removeButton);
      cartItemsList.appendChild(li);
    });
    totalPrice.textContent = `Total: $${total.toFixed(2)}`;
    updateCheckoutButtonVisibility();
  };

  const updateCheckoutButtonVisibility = () => {
    checkoutButton.style.display = itemsInCart.length > 0 ? "inline-block" : "none";
    updateCheckoutTotalPrice();
  };

  const updateCheckoutTotalPrice = () => {
    const total = itemsInCart.reduce((acc, itemIndex) => {
      const brownie = document.querySelectorAll(".brownie")[itemIndex];
      const browniePrice = parseFloat(brownie.querySelector(".price").textContent.slice(1));
      return acc + browniePrice;
    }, 0);
    checkoutTotalPrice.textContent = `Total: $${total.toFixed(2)}`;
    placeOrderButton.style.display = total > 0 ? "inline-block" : "none";
  };

  const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Gera um código de 6 dígitos
  };

  

  const finalizarPedido = async () => {
    const nome = document.getElementById("full-name").value;
    const bairro = document.getElementById("delivery-bairro").value;
    const numero = document.getElementById("delivery-numero").value;
    const apto = document.getElementById("delivery-apto").value || "N/A"; // Valor padrão se não for fornecido
    const bloco = document.getElementById("delivery-bloco").value || "N/A"; // Valor padrão se não for fornecido
  
    const enderecoEntrega = `${bairro}, ${numero}, Apto ${apto}, Bloco ${bloco}`;
    const dataEntrega = document.getElementById("delivery-date").value;
    const totalElement = document.getElementById("total-price");
    const totalText = totalElement.textContent; // Exemplo: "Total: $25.00"
    const totalValue = parseFloat(totalText.replace("Total: $", ""));
  
    // Coletar informações sobre os itens adicionados ao carrinho
    const itensDoPedido = [];
    itemsInCart.forEach(itemIndex => {
      const brownie = document.querySelectorAll(".brownie")[itemIndex];
      const brownieTitle = brownie.querySelector("h2").textContent;
      const browniePrice = parseFloat(brownie.querySelector(".price").textContent.slice(1));
      itensDoPedido.push({ nome: brownieTitle, valor: browniePrice });
    });

    const valorTotal = totalValue;
    const codigoAtivacao = generateActivationCode();
    
    const formatarItens = (itens) => {
        return itens.map(item => `${item.nome} - $${item.valor.toFixed(2)}`).join('\n');
      };
      
    const pedidoInfo = `Ola fiz um pedido com as seguintes informacoes:\n\n` +
    `Nome: ${nome}\nEndereco: ${enderecoEntrega}\nData de Entrega: ${dataEntrega}\n` +
    `Itens:\n${formatarItens(itensDoPedido)}\nValor Total: $${valorTotal}\n` +
    `Gostaria de verificar meu pagamento e o horario de entrega e talvez o frete.`;
    
  const numeroWhatsApp = "+5511951474600"; // Substitua pelo número de WhatsApp desejado
  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(pedidoInfo)}`;
    window.location.href = linkWhatsApp;

    // Enviar o pedido para o servidor
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedidoInfo)
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("activationCode", codigoAtivacao);
    } else {
      alert(data.message);
    }
  };

  updateCartButtons();
  checkoutButton.addEventListener("click", finalizarPedido);
});
