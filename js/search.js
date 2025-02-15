function convertEpochToDate(epochTime) {
  const date = new Date(epochTime * 1000); // Convert epoch time to milliseconds
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
  const year = date.getFullYear(); // Get full year
  return `${month}/${day}/${year}`; // Return formatted date
}

function replaceBoolean(value) {
  if (value === true) {
    return "Yes";
  } else if (value === false) {
    return "No";
  }
  return value; // Return the original value if it's not a boolean
}

$(function(){
  const cache = {};

  $("#header").load("../components/header.html", function() {
    // Fetch and display IP and User-Agent
    $.getJSON('http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/get_my_ip', function(data) {
      $('#my-ip').text(data.ip);
    });
    $('#my-user-agent').text(navigator.userAgent);
  });
  $("#footer").load("../components/footer.html");

  // Handle form submission
  $(".search-box").on("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    const query = $("input[name='query']").val();
    const endpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/search&search=${encodeURIComponent(query)}`;

    // Check cache
    if (cache[query]) {
      displayResponse(cache[query]);
      return;
    }

    // Clear previous response text and table
    $(".search-container p").remove();
    $(".search-container table").remove();

    // Show loading indicator
    $("#loading").show();

    $.ajax({
      url: endpoint,
      method: "GET", // Updated to use GET
      success: function(response) {
        if (response.status === "success") {
          if (response.type === "ip") {
            const ipEndpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/ip&ip=${encodeURIComponent(response.value)}`;
            $.ajax({
              url: ipEndpoint,
              method: "GET",
              success: function(ipResponse) {
                const details = ipResponse.details; // Extract details info
                const table = `
                  <table class="response-table">
                    <tr><th>IP</th><td>${details.host}</td></tr>
                    <tr><th>Location</th><td>${details.region} ${details.country_code}</td></tr>
                    <tr><th>Score (0 Best - 100 Bad)</th><td>${details.fraud_score}</td></tr>
                    <tr><th>Using VPN</th><td>${replaceBoolean(details.active_vpn)}</td></tr>
                    <tr><th>Is it a BOT</th><td>${replaceBoolean(details.bot_status)}</td></tr>
                    <tr><th>Is it a WebCrawler</th><td>${replaceBoolean(details.is_crawler)}</td></tr>
                    <tr><th>Recent Abuse</th><td>${replaceBoolean(details.recent_abuse)}</td></tr>
                    <tr><th>Help</th><td><a href="https://www.ipqualityscore.com/documentation/proxy-detection-api/response-parameters">Describe Parameters</a></td></tr>
                  </table>`;
                $(".search-container").append(table);
              },
              error: handleError
            });
          } else if (response.type === "email") {
            const emailEndpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/email&email=${encodeURIComponent(response.value)}`;
            $.ajax({
              url: emailEndpoint,
              method: "GET",
              success: function(emailResponse) {
                const details = emailResponse.details; // Extract details info
                const darkweb = emailResponse.darkweb; // Extract details info
                const table = `
                  <table class="response-table">
                    <tr><th>Email</th><td>${details.sanitized_email}</td></tr>
                    <tr><th>Overall score (0 Bad - 4 Best)</th><td>${details.overall_score}</td></tr>
                    <tr><th>Recent Abuse Reported</th><td>${replaceBoolean(details.recent_abuse)}</td></tr>
                    <tr><th>Has it been leaked</th><td>${replaceBoolean(details.leaked)}</td></tr>
                    <tr><th>Fraud Score (0 Best - 100 Worst)</th><td>${details.fraud_score}</td></tr>
                    <tr><th>First Seen</th><td>${details.first_seen.human}</td></tr>
                    <tr><th>Potentially Disposable Address</th><td>${replaceBoolean(details.disposable)}</td></tr>
                    <tr><th>User Activity (High - Best, Low - Worst)</th><td>${details.user_activity}</td></tr>
                    <tr><th>Help</th><td><a href="https://www.ipqualityscore.com/documentation/email-validation-api/response-parameters">Describe Parameters</a></td></tr>
                    <tr><th colspan="2" style="text-align: center;"><strong>DarkWeb Data</strong></th></tr>
                    <tr><th>Exposed on the dark web</th><td>${replaceBoolean(darkweb.exposed)}</td></tr>
                    <tr><th>First seen on dark web</th><td>${darkweb.first_seen.human}</td></tr>
                    <tr><th>Plaintext passwords exposed</th><td>${replaceBoolean(darkweb.plain_text_password)}</td></tr>
                  </table>`;
                $(".search-container").append(table);
              },
              error: handleError
            });
          } else if (response.type === "phone") {
            const phoneEndpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/phone&phone=${encodeURIComponent(response.value)}`;
            $.ajax({
              url: phoneEndpoint,
              method: "GET",
              success: function(phoneResponse) {
                const details = phoneResponse.details; // Extract details info
                const table = `
                  <table class="response-table">
                    <tr><th>Local Format</th><td>${details.local_format}</td></tr>
                    <tr><th>Is this an active number</th><td>${replaceBoolean(details.active)}</td></tr>
                    <tr><th>Carrier</th><td>${details.carrier}</td></tr>
                    <tr><th>Line Type</th><td>${details.line_type}</td></tr>
                    <tr><th>Location</th><td>${details.city} ${details.region}, ${details.country} ${details.zip_code}</td></tr>
                    <tr><th>Fraud Score (0 Best - 100 Worst)</th><td>${details.fraud_score}</td></tr>
                    <tr><th>Recent Abuse</th><td>${details.recent_abuse}</td></tr>
                    <tr><th>Is it Prepaid</th><td>${replaceBoolean(details.prepaid)}</td></tr>
                    <tr><th>Reported Spammer</th><td>${replaceBoolean(details.spammer)}</td></tr>
                    <tr><th>Associated Email</th><td>${details.associated_email_addresses.status}</td></tr>
                    <tr><th>Help</th><td><a href="https://www.ipqualityscore.com/documentation/phone-number-validation-api/response-parameters">Describe Parameters</a></td></tr>
                  </table>`;
                $(".search-container").append(table);
              },
              error: handleError
            });
          } else if (response.type === "dns") {
            const dnsEndpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/dns&domain=${encodeURIComponent(response.value)}`;
            $.ajax({
              url: dnsEndpoint,
              method: "GET",
              success: function(domainResponse) {
                const details = domainResponse.details; // Extract details info
                const table = `
                  <table class="response-table">
                    <tr><th>Domain Name</th><td>${details.domain_name}</td></tr>
                    <tr><th>Creation Date</th><td>${convertEpochToDate(details.creation_date)}</td></tr>
                    <tr><th>Expiration Date</th><td>${convertEpochToDate(details.expiration_date)}</td></tr>
                    <tr><th>Registrar</th><td>${details.registrar}</td></tr>
                    <tr><th>Whois Server</th><td>${details.whois_server}</td></tr>
                    <tr><th>Name Servers</th><td>${details.name_servers[0]}</td></tr>
                    <tr><th>Help</th><td><a href="https://www.api-ninjas.com/api/whois">Describe Parameters</a></td></tr>
                  </table>`;
                $(".search-container").append(table);
              },
              error: handleError
            });
          } else if (response.type === "routing_number") {
            const dnsEndpoint = `http://127.0.0.1:5000?url=http://localhost:5008/api/iptools/bank_routing&routing_number=${encodeURIComponent(response.value)}`;
            $.ajax({
              url: dnsEndpoint,
              method: "GET",
              success: function(domainResponse) {
                const details = domainResponse.details; // Extract details info
                const table = `
                  <table class="response-table">
                    <tr><th>Bank Name</th><td>${details[0].bank_name}</td></tr>
                    <tr><th>Routing Number</th><td>${details[0].routing_number}</td></tr>
                    <tr><th>Address</th><td>${details[0].street_address} ${details[0].city} ${details[0].state} ${details[0].zip_code} ${details[0].country}</td></tr>
                    <tr><th>Help</th><td><a href="https://www.api-ninjas.com/api/whois">Describe Parameters</a></td></tr>
                  </table>`;
                $(".search-container").append(table);
              },
              error: handleError
            });
          } else {
            const formattedText = `${response.message}`;
            $(".search-container").append(`<p class="response-text">${formattedText}</p>`);
          }
        } else if (response.status === "error") {
          handleError(response);
        }
      },
      error: handleError,
      complete: function() {
        // Hide loading indicator
        $("#loading").hide();
      }
    });

    function handleError(error) {
      console.error("Error calling the endpoint:", error);
      let errorMessage = error.message || "An unknown error occurred.";
      if (error.responseText) {
        try {
          const errorResponse = JSON.parse(error.responseText);
          errorMessage = `Error: ${errorResponse.message}`;
        } catch (e) {
          console.error("Error parsing the error response:", e);
        }
      }
      $(".search-container").append(`<p class="response-text">${errorMessage}</p>`); // Display error message
    }
  });
});
