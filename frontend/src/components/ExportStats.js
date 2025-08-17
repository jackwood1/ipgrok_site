import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "./ui";
export function ExportStats({ networkData, mediaData, systemData, quickTestData }) {
    const [exporting, setExporting] = useState(false);
    const exportAllStats = () => {
        setExporting(true);
        try {
            const exportData = {
                timestamp: new Date().toISOString(),
                network: networkData,
                media: mediaData,
                system: systemData,
                quickTest: quickTestData,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `video_call_test_results_${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Export failed:", error);
        }
        finally {
            setExporting(false);
        }
    };
    const exportCSV = () => {
        setExporting(true);
        try {
            let csvContent = "Test Type,Parameter,Value,Timestamp\n";
            // Add network data
            if (networkData?.speedTest) {
                csvContent += `Speed Test,Download,${networkData.speedTest.download} Mbps,${new Date().toISOString()}\n`;
                csvContent += `Speed Test,Upload,${networkData.speedTest.upload} Mbps,${new Date().toISOString()}\n`;
                csvContent += `Speed Test,Latency,${networkData.speedTest.latency}ms,${new Date().toISOString()}\n`;
                csvContent += `Speed Test,Jitter,${networkData.speedTest.jitter}ms,${new Date().toISOString()}\n`;
                // Add enhanced metrics
                if (networkData.speedTest.bandwidthScore) {
                    csvContent += `Speed Test,Bandwidth Score,${networkData.speedTest.bandwidthScore}/100,${new Date().toISOString()}\n`;
                }
                if (networkData.speedTest.packetLossRate !== undefined) {
                    csvContent += `Speed Test,Packet Loss Rate,${networkData.speedTest.packetLossRate}%,${new Date().toISOString()}\n`;
                }
                if (networkData.speedTest.connectionQuality) {
                    csvContent += `Speed Test,Connection Quality,${networkData.speedTest.connectionQuality},${new Date().toISOString()}\n`;
                }
                if (networkData.speedTest.qualityScore !== undefined) {
                    csvContent += `Speed Test,Quality Score,${networkData.speedTest.qualityScore}/100,${new Date().toISOString()}\n`;
                }
                if (networkData.speedTest.recommendations) {
                    networkData.speedTest.recommendations.forEach((rec, index) => {
                        csvContent += `Speed Test,Recommendation ${index + 1},"${rec}",${new Date().toISOString()}\n`;
                    });
                }
            }
            // Add advanced network tests data
            if (networkData?.advancedTests) {
                if (networkData.advancedTests.dnsPerformance) {
                    csvContent += `Advanced Test,DNS Performance,${networkData.advancedTests.dnsPerformance.responseTime}ms,${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,DNS Status,${networkData.advancedTests.dnsPerformance.status},${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.httpPerformance) {
                    csvContent += `Advanced Test,HTTP Performance,${networkData.advancedTests.httpPerformance.responseTime}ms,${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,HTTP Status,${networkData.advancedTests.httpPerformance.status},${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.httpsPerformance) {
                    csvContent += `Advanced Test,HTTPS Performance,${networkData.advancedTests.httpsPerformance.responseTime}ms,${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,HTTPS Status,${networkData.advancedTests.httpsPerformance.status},${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.cdnPerformance) {
                    csvContent += `Advanced Test,CDN Performance,${networkData.advancedTests.cdnPerformance.responseTime}ms,${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,CDN Status,${networkData.advancedTests.cdnPerformance.status},${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.vpnDetection) {
                    csvContent += `Advanced Test,VPN Detected,${networkData.advancedTests.vpnDetection.isVPN},${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,VPN Confidence,${networkData.advancedTests.vpnDetection.confidence}%,${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,VPN Reason,"${networkData.advancedTests.vpnDetection.reason}",${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.networkType) {
                    csvContent += `Advanced Test,Network Type,${networkData.advancedTests.networkType.type},${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,Network Details,"${networkData.advancedTests.networkType.details}",${new Date().toISOString()}\n`;
                }
                if (networkData.advancedTests.securityTests) {
                    csvContent += `Advanced Test,SSL Valid,${networkData.advancedTests.securityTests.sslValid},${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,Firewall Detection,"${networkData.advancedTests.securityTests.firewallDetection}",${new Date().toISOString()}\n`;
                    csvContent += `Advanced Test,Proxy Detection,"${networkData.advancedTests.securityTests.proxyDetection}",${new Date().toISOString()}\n`;
                }
            }
            if (networkData?.pingTest) {
                csvContent += `Ping Test,Host,${networkData.pingTest.host},${new Date().toISOString()}\n`;
                csvContent += `Ping Test,Success Rate,${networkData.pingTest.successRate}%,${new Date().toISOString()}\n`;
                csvContent += `Ping Test,Average Time,${networkData.pingTest.averageTime}ms,${new Date().toISOString()}\n`;
            }
            if (networkData?.tracerouteTest) {
                csvContent += `Traceroute,Host,${networkData.tracerouteTest.host},${new Date().toISOString()}\n`;
                csvContent += `Traceroute,Total Hops,${networkData.tracerouteTest.totalHops},${new Date().toISOString()}\n`;
                csvContent += `Traceroute,Successful Hops,${networkData.tracerouteTest.successfulHops},${new Date().toISOString()}\n`;
                // Add individual hop details
                networkData.tracerouteTest.results.forEach((hop, index) => {
                    csvContent += `Traceroute Hop ${hop.hop},FQDN,${hop.fqdn},${new Date().toISOString()}\n`;
                    csvContent += `Traceroute Hop ${hop.hop},IP Address,${hop.ip},${new Date().toISOString()}\n`;
                    csvContent += `Traceroute Hop ${hop.hop},Response Time,${hop.time}ms,${new Date().toISOString()}\n`;
                    csvContent += `Traceroute Hop ${hop.hop},Status,${hop.status},${new Date().toISOString()}\n`;
                });
            }
            // Add system data
            if (systemData) {
                csvContent += `System,IP Address,${systemData.ipAddress},${new Date().toISOString()}\n`;
                csvContent += `System,Platform,${systemData.platform},${new Date().toISOString()}\n`;
                csvContent += `System,Screen Resolution,${systemData.screenResolution},${new Date().toISOString()}\n`;
                csvContent += `System,Timezone,${systemData.timezone},${new Date().toISOString()}\n`;
                csvContent += `System,WebGL Support,${systemData.webGL},${new Date().toISOString()}\n`;
                if (systemData.cores)
                    csvContent += `System,CPU Cores,${systemData.cores},${new Date().toISOString()}\n`;
                if (systemData.memory)
                    csvContent += `System,Device Memory,${systemData.memory} GB,${new Date().toISOString()}\n`;
                if (systemData.batteryLevel)
                    csvContent += `System,Battery Level,${systemData.batteryLevel}%,${new Date().toISOString()}\n`;
            }
            // Add media data
            if (mediaData) {
                csvContent += `Media,Permissions,${mediaData.permissions},${new Date().toISOString()}\n`;
                if (mediaData.devices) {
                    csvContent += `Media,Microphone,${mediaData.devices.microphone},${new Date().toISOString()}\n`;
                    csvContent += `Media,Camera,${mediaData.devices.camera},${new Date().toISOString()}\n`;
                }
                if (mediaData.micStats) {
                    csvContent += `Media,Average Volume,${mediaData.micStats.averageVolume},${new Date().toISOString()}\n`;
                    csvContent += `Media,Peak Volume,${mediaData.micStats.peakVolume},${new Date().toISOString()}\n`;
                }
            }
            // Add quick test data
            if (quickTestData) {
                csvContent += `Quick Test,Network Status,${quickTestData.networkStatus},${new Date().toISOString()}\n`;
                csvContent += `Quick Test,Media Status,${quickTestData.mediaStatus},${new Date().toISOString()}\n`;
                csvContent += `Quick Test,Overall Status,${quickTestData.overallStatus},${new Date().toISOString()}\n`;
            }
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `video_call_test_results_${Date.now()}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("CSV export failed:", error);
        }
        finally {
            setExporting(false);
        }
    };
    const hasData = networkData || mediaData || systemData || quickTestData;
    if (!hasData) {
        return null;
    }
    return (_jsxs("div", { className: "flex flex-col sm:flex-row gap-3", "data-export-stats": true, children: [_jsx(Button, { onClick: exportAllStats, loading: exporting, variant: "info", size: "md", className: "flex-1 sm:flex-none", children: exporting ? "Exporting..." : "Export All Stats (JSON)" }), _jsx(Button, { onClick: exportCSV, loading: exporting, variant: "secondary", size: "md", className: "flex-1 sm:flex-none", children: exporting ? "Exporting..." : "Export All Stats (CSV)" })] }));
}
