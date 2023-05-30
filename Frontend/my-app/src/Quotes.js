import "./Quotes.css"

export function Quotes() {

    const quotes = [
        [["”I think there needs to be a change of consciousness with the news ... to try to seek a higher ground. Why can't it be more representative of the way the world really is? I think we don\'t know what the bombardment of crime and violence does to our minds, I think we\'re in denial about it.”"], ["Oprah Winfrey"]],
        [["”We are the good news that we have been looking for, Demonstrating that every dusk holds a dawn disguised within it.Today we don't burst into a new world.We begin it."], ["Amanda Gorman"]],
        [["”A lot of times good news happens slowly and bad news happens all at once. And so we tend to focus on the bad news that’s crashing over us in waves, and not on the slow long-term work that people are doing together to try to make a better world for us to share.”"], ["John Green"]],
        [["”Bad news travels at the speed of light; good news travels like molasses.”"], ["Tracy Morgan"]],
        [["”The good news is that every morning we have the choice; not to be controlled by circumstances nor our past but by purposely designing our day, hence our lives better. Not to react to life but to respond with love.” "], ["Bernard Kelvin Clive"]],
        [["”I realize how this event [the 'Miracle on the Hudson] had touched people's lives, how ready they were for good news, how much they wanted to feel hopeful again. We've had a worldwide economic downturn, and people are confused, fearful and just so ready for good news. They want to feel reassured that all the things we value, all our ideals, still exist.”"], ["Captain “Sully” Sullenberger"]],
        [["”It's good to remember that in crises, natural crises, human beings forget for awhile their ignorances, their biases, their prejudices. For a little while, neighbors help neighbors and strangers help strangers.”"], ["Dr. Maya Angelou"]],
        [["”I'm convinced of this: Good done anywhere is good done everywhere. For a change, start by speaking to people rather than walking by them like they're stones that don't matter. As long as you're breathing, it's never too late to do some good.”"], ["Dr. Maya Angelou"]],
        [["”The news media are, for the most part, the bringers of bad news... and it's not entirely the media's fault, bad news gets higher ratings and sells more papers than good news.”"], [" — Peter McWilliams"]],
        [["”I have found ... that people are thirsting for images of goodness in order to maintain their hope in a difficult world. Sometimes, the measure of our work as journalists is not the professional recognition of colleagues, but rather the mark we make in the hearts of readers who see our work.”"], ["Gerald Herbert"]],
        [["”Bad news travels fast. Good news takes the scenic route.”"], ["Doug Larson"]],
        [["”Headlines, in a way, are what mislead you because bad news is a headline, and gradual improvement is not.”"], ["Bill Gates"]],
        [["”My job is to collect stories of hope — because there's so much going on that's awful. Animals becoming extinct, forests disappearing, people suffering tremendously. If this is the only aspect that gets out to the general public, they think there's not much we can do and they do nothing. And so these stories that show what can be done I think are tremendously important.”"], ["Jane Goodall"]],
        [["”Everyone has inside of him a piece of good news. The good news is that you don't know how great you can be! How much you can love! What you can accomplish! And what your potential is!”"], ["Anne Frank"]],
        [["”The good news is we have everything we need to leave fossil fuels in the ground. All we need is for you to join the rest of the world to bring about a cleaner, more stable, and peaceful future.”"], ["Mark Ruffalo"]],
        [["“Newspapers cannot be defined by the second word — paper.  They’ve got to be defined by the first word — news.”"], ["Arthur Sulzberger, Jr."]],
        [["“Were it left to me to decide if we should have a government without newspapers, or newspapers without a government, I should not hesitate a moment to prefer the latter.”"], ["Thomas Jefferson"]],
        [["“Most of us probably feel we couldn’t be free without newspapers, and that is the real reason we want newspapers to be free.”"], ["Edward R. Murrow"]],
        [["“Every time a newspaper dies, even a bad one, the country moves a little closer to authoritarianism…”"], ["Richard Kluger"]],
        [["“I don't believe newspaper reporters can substitute for a district attorney, but a newspaper has a very valid investigative role. Newspaper reports on corruption in government, racketeering and organized crime conditions can be very helpful to your communities and the whole country.”"], ["Robert Kennedy"]],
        [["“It is usually known that newspapers do not say the truth, but it is also known that they cannot tell whoppers.”"], ["George Orwell"]],
        [["“People don’t actually read newspapers.  They step into them every morning like a hot bath.”"], ["Marshall McLuhan"]],
        [["“I’d love to rise from the grave every ten years or so and go buy a few newspapers.”"], ["Luis Bunuel"]],
        [["“Newspapers are tutors as well as informers.”"], ["Neil Kinnock"]],
        [["“The newspaper is a greater treasure to the people than uncounted millions of gold.”"], ["Henry Ward Beecher"]],
        [["“What a newspaper needs in its news, in its headlines, and on its editorial page is terseness, humor, descriptive power, satire, originality, good literary style, clever condensation, and accuracy, accuracy, accuracy!”"], ["Joseph Pulitzer"]],
        [["“We read the weird tales in newspapers to crowd out the even weirder stuff inside us.”"], ["Alain de Botton"]],
        [["“In America, the president reigns for four years, and journalism governs forever and ever.“"],["Oscar Wilde"]],
        [["“Journalism allows its readers to witness history; fiction gives its readers an opportunity to live it.“"], ["John Hersey"]]
    ]

    function getRandomQuote() {

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex]
        console.log(randomIndex)
        return (
            <>
                <blockquote id="quote-text">{randomQuote[0]}</blockquote>
                <cite id="quote-author">{randomQuote[1]}</cite>
            </>
        );
    }

    return (
        <div id="quote-container">
            {getRandomQuote()}
        </div>
    );
}
