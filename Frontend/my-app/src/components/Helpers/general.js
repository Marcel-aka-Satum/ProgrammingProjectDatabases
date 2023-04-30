import {SUCCESS} from "./custom_alert";
import {
    FacebookIcon,
    FacebookShareButton,
    FacebookShareCount,
    RedditIcon,
    RedditShareButton,
    RedditShareCount,
    TumblrIcon,
    TumblrShareButton,
    TumblrShareCount,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import React from "react";

function formatTitle(str) {
    const words = str.split('-');
    const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function formatSummary(text, limit = 200) {
    if (text.length <= limit) {
        return [text, false];
    } else {
        const truncatedText = text.slice(0, limit);
        return [truncatedText.trim() + '...', true];
    }
}

const handleHideArticle = () => {
    SUCCESS('Not implemented yet.');
};

const handleClipboard = () => {
    SUCCESS('Link is successfully copied to your clipboard');
};

function PrintNewspaper(url) {
    const URL = url.url;
    const matches = URL.match(/^https?:\/\/(www\.)?([^/?#]+)/);
    const hostname = matches[2];
    return (hostname.startsWith("www.") ? hostname.substring(4) : hostname)
}

function extractBaseUrl(url) {
    const matches = url.match(/^https?:\/\/(www\.)?([^/?#]+)/);

    const hostname = matches[2];

    return (hostname.startsWith("www.") ? hostname.substring(4) : hostname)
}

function shares(article) {
    return (
        <div className="mt-3" style={{display: 'flex', justifyContent: 'space-between'}}>
            <FacebookShareButton url={article.URL} hashtag='#Newsaggregator'
                                 className="mr-3">
                <FacebookIcon size={70} round={true}/>
                <FacebookShareCount url={article.URL}>
                    {count => <div className="share-count">{count}</div>}
                </FacebookShareCount>
            </FacebookShareButton>
            <WhatsappShareButton url={article.URL} className="mr-3">
                <WhatsappIcon size={70} round={true}/>
            </WhatsappShareButton>
            <TwitterShareButton
                url={article.URL}
                title="Look which article I found at Newsaggregator"
                hashtags={['Newsaggregator']}
            >
                <TwitterIcon size={70} round/>
            </TwitterShareButton>
            <RedditShareButton url={article.URL}
                               title="Look which article I found at Newsaggregator"
                               className="mr-3">
                <RedditIcon size={70} round={true}/>
                <RedditShareCount url={article.URL}>
                    {count => <div className="share-count">{count}</div>}
                </RedditShareCount>
            </RedditShareButton>
            <TumblrShareButton url={article.URL}
                               title="Look which article I found at Newsaggregator"
                               className="mr-3">
                <TumblrIcon size={70} round={true} style={{marginTop: '18px'}}/>
                <TumblrShareCount url={article.URL}>
                    {count => <div className="share-count">{count}</div>}
                </TumblrShareCount>
            </TumblrShareButton>
        </div>
    )
}


export {
    formatTitle,
    formatDate,
    formatSummary,
    handleClipboard,
    handleHideArticle,
    PrintNewspaper,
    shares,
    extractBaseUrl
};
