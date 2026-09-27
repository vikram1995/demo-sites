#!/usr/bin/env python3
"""Static file server for the demo site that disables browser caching.

Prevents the browser from reusing a stale demo-config.js (which was pointing at
an old placeholder site key and causing 404s on /widget-config).
"""
import http.server
import socketserver

PORT = 8080


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving demo-website on http://localhost:{PORT} (no-cache)")
        httpd.serve_forever()
