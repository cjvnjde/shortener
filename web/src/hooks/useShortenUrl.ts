import { useCallback, useState } from "react";
import config from "../config";

export function useShortenUrl() {
  const [shortenUrl, setShortenUrl] = useState('');

  const submitUrl = useCallback((url: string) => {
    fetch(`${config.domain}api/shorten`, {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(r => r.json()).then(data => {
      setShortenUrl(`${config.domain}${data.key}`)
    })
  }, [])

  return {
    shortenUrl,
    submit: submitUrl,
  }
}