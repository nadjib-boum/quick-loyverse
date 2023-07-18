window.onload = async () => {
  const addCompany = document.querySelector("#addCompany");
  const {
    data: { authUri },
  } = await fetchData("/api/quickbooks/auth");
  addCompany.href = authUri;
};

async function fetchData(url, options = {}) {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
}
