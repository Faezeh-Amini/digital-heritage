namespace Digital_Heritage.Data;

/// <summary>
/// Ein Eintrag im Bildnachweis. GroupId bestimmt den Abschnitt auf der Seite "Über das Projekt".
/// </summary>
public sealed record ImageCredit(
    string GroupId,
    string Title,
    string Author,
    string License,
    string LicenseUrl,
    string SourceUrl);

/// <summary>
/// Nur geprüfte Einträge aufnehmen: Urheber, Lizenz UND Quell-Link müssen stimmen.
/// Neue Bilder einfach als weitere Zeile ergänzen (Daten aus Bildnachweis_Musikseite.xlsx).
/// Die 7 Einträge unten stimmen mit IMAGE-CREDITS.txt überein.
/// </summary>
public static class ImageCredits
{
    public static IReadOnlyList<ImageCredit> All { get; } = new[]
    {
        // Gruppe "sites": Historische und archäologische Stätten
        new ImageCredit("sites", "Bisotun World Heritage Site", "Hamzeh Einy Nezhad (H.einy)", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://commons.wikimedia.org/wiki/File:Bisotun_World_Heritage_Site.jpg"),
        new ImageCredit("sites", "Bisotun inscription", "Sima Farshid (Simashid)", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://commons.wikimedia.org/wiki/File:Bisotoun_Inscription.jpg"),
        new ImageCredit("sites", "Anubanini relief (Sar-e Pol-e Zahab)", "dynamosquito (Flickr)", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/",
            "https://commons.wikimedia.org/wiki/File:Anubanini_(3936968576).jpg"),
        new ImageCredit("sites", "Anubanini relief, drawing", "Jona Lendering", "CC0 1.0", "https://creativecommons.org/publicdomain/zero/1.0/",
            "https://commons.wikimedia.org/wiki/File:Sar-e_Pol-e_Zahab,_Anubanini_Relief,_drawing.jpg"),
        new ImageCredit("sites", "Shanidar Cave", "Khoshhat", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://commons.wikimedia.org/wiki/File:Shanidar_Cave0.jpg"),
        new ImageCredit("sites", "Shanidar Cave, overview", "Hardscarf", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://commons.wikimedia.org/wiki/File:Shanidar_Cave_-_overview.jpg"),
        new ImageCredit("sites", "Shanidar Cave, excavations", "Hardscarf", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://commons.wikimedia.org/wiki/File:Shanidar_Cave_-_excavations.jpg"),
    };
}
