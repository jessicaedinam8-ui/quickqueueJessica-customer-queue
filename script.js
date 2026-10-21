
const customerQueue = [];

let nextTicketNumber = 1;
let servedCount = 0;
let totalAdded = 0;

const customerForm = document.getElementById("customerForm");
const customerNameInput = document.getElementById("customerName");
const serviceTypeInput = document.getElementById("serviceType");
const queueList = document.getElementById("queueList");
const emptyState = document.getElementById("emptyState");
const statusMessage = document.getElementById("statusMessage");
const nowServing = document.getElementById("nowServing");

// Display the customers and update the totals.
function renderQueue() {
  queueList.innerHTML = "";

  customerQueue.forEach((customer, index) => {
    const item = document.createElement("div");
    item.className = "queue-item";

    const position = document.createElement("div");
    position.className = "queue-position";
    position.textContent = String(index + 1).padStart(2, "0");

    const info = document.createElement("div");
    info.className = "customer-info";

    const name = document.createElement("p");
    name.className = "customer-name";
    name.textContent = `${customer.ticket} · ${customer.name}`;

    const service = document.createElement("p");
    service.className = "customer-service";
    service.textContent = customer.service;

    const label = document.createElement("span");
    label.className = "waiting-label";
    label.textContent = "WAITING";

    info.append(name, service);
    item.append(position, info, label);
    queueList.appendChild(item);
  });

  emptyState.hidden = customerQueue.length > 0;

  document.getElementById("waitingCount").textContent =
    customerQueue.length;
  document.getElementById("servedCount").textContent = servedCount;
  document.getElementById("totalCount").textContent = totalAdded;
  document.getElementById("queuePill").textContent =
    customerQueue.length;
}

// Add a customer to the back of the queue.
customerForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = customerNameInput.value.trim();
  const service = serviceTypeInput.value;

  if (name === "") {
    statusMessage.textContent = "Please enter a customer name.";
    return;
  }

  const customer = {
    ticket: `Q${String(nextTicketNumber).padStart(3, "0")}`,
    name: name,
    service: service
  };

  // ENQUEUE: push() adds the customer to the end.
  customerQueue.push(customer);

  nextTicketNumber++;
  totalAdded++;

  customerForm.reset();
  customerNameInput.focus();

  statusMessage.textContent =
    `${customer.name} has been added to the queue.`;

  renderQueue();
});

// Serve the customer at the front of the queue.
document.getElementById("serveNextBtn").addEventListener("click", function() {
  if (customerQueue.length === 0) {
    statusMessage.textContent =
      "The queue is empty. Add a customer first.";
    return;
  }

  // DEQUEUE: shift() removes the first customer.
  const customer = customerQueue.shift();

  servedCount++;

  nowServing.innerHTML = "";

  const name = document.createElement("p");
  name.className = "serving-name";
  name.textContent = customer.name;

  const meta = document.createElement("p");
  meta.className = "serving-meta";
  meta.textContent = `${customer.ticket} · ${customer.service}`;

  nowServing.append(name, meta);

  statusMessage.textContent = `Now serving ${customer.name}.`;

  renderQueue();
});

// Clear customers who are still waiting.
document.getElementById("clearQueueBtn").addEventListener("click", function() {
  if (customerQueue.length === 0) {
    statusMessage.textContent =
      "There are no waiting customers to clear.";
    return;
  }

  const confirmed = window.confirm(
    "Clear all customers currently waiting?"
  );

  if (!confirmed) {
    return;
  }

  customerQueue.length = 0;

  statusMessage.textContent = "The waiting list has been cleared.";

  renderQueue();
});

// Show the initial empty queue.
renderQueue();
