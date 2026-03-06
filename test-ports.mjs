// Test both ports
async function testPorts() {
  const ports = [3000, 3001, 3002];

  for (const port of ports) {
    console.log(`\n🔍 Testing port ${port}...`);
    try {
      const response = await fetch(
        `http://localhost:${port}/api/get-submissions`,
      );
      const data = await response.json();

      console.log(`✅ Port ${port} is accessible`);
      console.log("Response status:", response.status);
      console.log("Data count:", data.data?.length || 0);

      if (data.data && data.data.length > 0) {
        console.log(
          `\n✅ Found ${data.data.length} submissions on port ${port}`,
        );
        return;
      }
    } catch (error) {
      console.log(`❌ Port ${port} not accessible:`, error.message);
    }
  }
}

testPorts();
