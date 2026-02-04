
import HomeHero from "../Home/home-sub/Home-Hero.jsx"
import HomeImpact from "../Home/home-sub/Home-Impact.jsx"
import HomeOrigins from "./home-sub/Home-Origins.jsx";
import HomeResults from "./home-sub/Home-Results.jsx";
import HomePartners from "./home-sub/Home-Partners.jsx";
import HomeNumbers from "./home-sub/Home-Numbers.jsx";
import HomeGallery from "./home-sub/Home-Gallery.jsx";
import HomeFAQ from "./home-sub/Home-FAQ.jsx";

export default function Home() {

  return (
    <main>

        <HomeHero/>

        <HomeImpact/>
        
        <HomeOrigins/>

        <HomeResults/>

        <HomePartners/>
        
        <HomeGallery/>
        
        <HomeFAQ/>

    </main>
  );
}
    