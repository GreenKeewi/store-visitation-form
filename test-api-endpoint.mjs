// Test the actual API endpoint
async function testAPI() {
  console.log("🔍 Testing /api/get-submissions endpoint on port 3000...\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("http://localhost:3000/api/get-submissions", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.success && data.data && data.data.length > 0) {
      console.log(`\n✅ Found ${data.data.length} submissions`);
      console.log("\nFirst submission:");
      console.log(JSON.stringify(data.data[0], null, 2));
    } else {
      console.log("\n⚠️ No submissions found in API response");
      console.log("Message:", data.message);
    }
  } catch (error) {
    console.error("❌ Error fetching from API:", error.message);
    if (error.name === "AbortError") {
      console.error("Request timed out after 5 seconds");
    }
  }
}

testAPI();
