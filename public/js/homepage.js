let quoteSource = [
    { quote: "The Way Get Started Is To Quit Talking And Begin Doing.", author: "Walt Disney" },
    { quote: "The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.", author: "Winston Churchill" },
    { quote: "Don’t Let Yesterday Take Up Too Much Of Today.", author: "Will Rogers" },
    { quote: "You Learn More From Failure Than From Success. Don’t Let It Stop You. Failure Builds Character.", author: "Unknown" },
    { quote: "It’s Not Whether You Get Knocked Down, It’s Whether You Get Up.", author: "Vince Lombardi" },
    { quote: "People Who Are Crazy Enough To Think They Can Change The World, Are The Ones Who Do.", author: "Rob Siltanen" },
    { quote: "We May Encounter Many Defeats But We Must Not Be Defeated.", author: "Maya Angelou" },
    { quote: "Knowing Is Not Enough; We Must Apply. Wishing Is Not Enough; We Must Do.", author: "Johann Wolfgang Von Goethe" },
    { quote: "We Generate Fears While We Sit. We Overcome Them By Action.", author: "Dr. Henry Link" },
    { quote: "Whether You Think You Can Or Think You Can’t, You’re Right.", author: "Henry Ford" },
    { quote: "The Man Who Has Confidence In Himself Gains The Confidence Of Others.", author: "Hasidic Proverb" },
    { quote: "The Only Limit To Our Realization Of Tomorrow Will Be Our Doubts Of Today.", author: "Franklin D. Roosevelt" },
    { quote: "What You Lack In Talent Can Be Made Up With Desire, Hustle And Giving 110% All The Time.", author: "Don Zimmer" },
    { quote: "Do What You Can With All You Have, Wherever You Are.", author: "Theodore Roosevelt" },
    { quote: "You Are Never Too Old To Set Another Goal Or To Dream A New Dream.", author: "C.S. Lewis" },
    { quote: "To See What Is Right And Not Do It Is A Lack Of Courage.", author: "Confucius" },
    { quote: "Things Work Out Best For Those Who Make The Best Of How Things Work Out.", author: "John Wooden" },
    { quote: "You Don’t Have To Be Great To Start, But You Have To Start To Be Great.", author: "Zig Ziglar" },
]

$(() => {

    let randomQuote = quoteSource[Math.floor(Math.random() * quoteSource.length)];


    $('.quote-text').text(randomQuote.quote);
    $('.quote-author').text(randomQuote.author);
});