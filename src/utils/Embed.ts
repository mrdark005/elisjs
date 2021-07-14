export interface EmbedAuthor {
  name: string;
  icon_url?: string;
  url?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedThumbnail {
  url: string;
}

export interface EmbedImage {
  url: string;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export class Embed {
  public title?: string;
  public description?: string;
  public color?: number;
  public timestamp?: number;
  public url?: string;
  public author?: EmbedAuthor;
  public footer?: EmbedFooter;
  public image?: EmbedImage;
  public thumbnail?: EmbedThumbnail;
  public fields: EmbedField[];

  constructor(embed: any) {
    this.fields = [];

    if (typeof embed == "object") {
      this.title = embed.title;
      this.description = embed.description;
      this.author = embed.author;
      this.footer = embed.footer;
      this.image = embed.image;
      this.thumbnail = embed.thumbnaiL;

      if (Array.isArray(embed.fields)) {
        this.fields = embed.fields;
      }
    }
  }

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setColor(color: number) {
    this.color = color;
    return this;
  }

  setTimestamp(timestamp: number = Date.now()) {
    this.timestamp = timestamp;
    return this;
  }

  setURL(url: string) {
    this.url = url;
    return this;
  }

  setAuthor(name: string, icon_url?: string, url?: string) {
    this.author = { name, icon_url, url };
    return this;
  }

  setFooter(text: string, icon_url?: string) {
    this.footer = { text, icon_url };
    return this;
  }

  setImage(url: string) {
    this.image = { url };
    return this;
  }

  setThumbnail(url: string) {
    this.thumbnail = { url };
    return this;
  }

  addField(name: string, value: string, inline: boolean = false) {
    if (this.fields.length != 25) {
      this.fields.push({ name, value, inline });
    }

    return this;
  }
}
