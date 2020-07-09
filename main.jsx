class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURLs: null,
            numOfImage: 10,
            page: 1,
            //submittedQuery when we want the old query, currentQuery when we want the new new.
            currentQuery: '',
            submittedQuery: '',
            currentColor: 'any',
            submittedColor: '',
        };
    }

    onChangeSearch = async (event) => {
        const query = event.target.value;
        this.setState({ currentQuery: query });
    };

    onChangeColor = async (event) => {
        const color = event.target.value;
        this.setState({ currentColor: color });
    };

    onNextButton = () => {
        let newPage = this.state.page + 1;
        //when we press Next Button or Previous Button, we need the old color and query (submittedColor, submittedQuery). we don't need to reset it
        this.fetchSearchResult(newPage, this.state.submittedQuery, this.state.submittedColor);
        this.setState({
            page: newPage,
        })
    }

    onPreviousButton = () => {
        let newPage = this.state.page - 1;
        this.fetchSearchResult(newPage, this.state.submittedQuery, this.state.submittedColor)
        this.setState({
            page: newPage,
        })
    }
    onSubmitForm = async () => {
        //Every submit handler needs one event.preventDefault
        event.preventDefault();
        let page = 1;
        this.fetchSearchResult(page, this.state.currentQuery, this.state.currentColor)
        this.setState({
            // when we press search button, it reset all these variables:
            page: 1,
            submittedQuery: this.state.currentQuery,
            submittedColor: this.state.currentColor,
        })
    }

    fetchSearchResult = async (page, query, color) => {
        //I should put this in the method that I refer to in onSubmit
        // Whenever we assign a  function to onSubmit, we need to have event.preventDefault() in that function. Otherwise the page will reload when we submit the form

        //We do not need event.preventDefault() here, because we are already calling it inside onSubmitForm:
        //event.preventDefault();
        const API_KEY = '16875123-eda44252100e34f42b1f3ab58';
        const searchUrl = "https://pixabay.com/api/?key=" + API_KEY + '&q=' + query + '&page=' + page + '&per_page=' + this.state.numOfImage + "&colors=" + color;
        let response = await fetch(searchUrl);
        let imageURLs = await response.json();
        this.setState({
            imageURLs: imageURLs,
        });
    }

    render() {
        let results = null;
        let disablePrevious = true;
        let disableNext = false;
        const colors = ['any', 'brown', 'red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'white', 'gray', 'black'];

        if (this.state.imageURLs) {
            if (this.state.page > 1) {
                disablePrevious = false
            }

            // for disabling the the 'next page' after we see all images
            let remainingImages = this.state.imageURLs.totalHits - (this.state.page * this.state.numOfImage);
            if (remainingImages <= this.state.numOfImage) {
                disableNext = true;
            }

            results =
                <div className="results">
                    <div className="photo-list">
                        {this.state.imageURLs.hits.map((hit) =>
                            // key={hit.id} to image simply is not shown until it is loaded, but the title is shown immediately under a blank image
                            <a className="photo" target="_blank" href={hit.largeImageURL} key={hit.id}>
                                <img className="photo-image" src={hit.webformatURL} />
                                <div className="photo-caption">
                                    <p className="photo-title">{hit.tags}</p>
                                    <p className="photo-author">taken by: {hit.user}</p>
                                </div>
                            </a>
                        )}
                    </div>
                    <div className="result-buttons">
                        <button className="previous-button" type="button" disabled={disablePrevious} onClick={this.onPreviousButton}>Previous Page</button>
                        <button className="next-button" type="button" disabled={disableNext}
                            onClick={this.onNextButton} >Next Page </button>
                        {results}
                    </div>
                </div>
        }
        return (
            <div className="app">
                <div className="menu">
                    <h1 className="page-title">📷 Pixabay Image Search 🖼️</h1>
                    <form className="search-form" onSubmit={this.onSubmitForm}>
                        <input
                            id="query"
                            className="search-query"
                            type="text"
                            placeholder="Search for…"
                            value={this.state.currentQuery}
                            autoFocus
                            onChange={this.onChangeSearch} />
                        <button className="search-button" type="submit">Search 🔍</button>
                        {/* name="color"-> giving the same "name" attribute to each input. so if we select a new color, the old one is not highlighted  */}
                        <div className="search-colors"
                            onChange={this.onChangeColor}>
                            {colors.map(color =>
                                <input type="radio" name="color" value={color} checked={this.state.currentColor === color} title={ color}/>)}
                        </div>
                    </form>
                </div>
                <div className="results">
                    <div className="result-buttons">
                        {results}
                    </div>

                </div>

            </div>
        );
    }
}

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);