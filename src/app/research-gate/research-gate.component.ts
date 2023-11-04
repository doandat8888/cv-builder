import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

interface ProfileData {
  about: {
    citations: string;
    introduction: string;
    number_of_publications: string;
    reads: string;
    skills: string[];
  };
  basic_info: {
    avatar: string;
    current_position: string;
    department: string;
    institution: string;
    name: string;
  };
  co_authors: {
    name: string;
    link: string;
    avatar: string;
    current_institution: string;
  }[];
  publications: {
    title: string;
    date_published: string;
    description: string;
    publication_link: string;
    publication_type: string;
    authors: string[];
  }[];
}

@Component({
  selector: 'app-research-gate',
  templateUrl: './research-gate.component.html',
  styleUrls: ['./research-gate.component.css']
})
export class ResearchGateComponent {
  profileUrl: string = '';
  jsonData: any = {}; // JSON data received from the API

  constructor(private http: HttpClient) { }

  generatePdf() {
    // Call the API with the profile URL
    this.http.post('https://web-scraper-j7yr.onrender.com/scrape', { profileUrl: this.profileUrl })
      .subscribe((data: any) => {
        // Store the received JSON data
        this.jsonData = data;

        // Generate the PDF
        const docDefinition = this.createPdfDefinition(this.jsonData);
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.download('research-gate-profile.pdf');
      });
  }

  createPdfDefinition(data: ProfileData) {
    const docDefinition = {
      content: [
        { text: 'ResearchGate Profile', style: 'header' },
        //Basic information
        { text: data.basic_info.name, style: 'subheader' },
        data.basic_info.institution,
        data.basic_info.department,
        data.basic_info.current_position,

        //About
        {text: 'Introduction', style:'subheader'},
        data.about.introduction,
        { text: 'Skills', style: 'subheader' },
        { ul: data.about.skills },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Citations', 'Publications', 'Reads'],
              [
                data.about.citations,
                data.about.number_of_publications,
                data.about.reads
              ],
            ],
          },
        },

        // Co-authors section
        { text: 'Co-Authors', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Name', 'Current Institution', 'Link'],
              ...data.co_authors.map(coAuthor => [
                coAuthor.name,
                coAuthor.current_institution,
                coAuthor.link
              ]),
            ],
          },
        },

        // Publications section
        { text: 'Publications', style: 'subheader' },
        {
          ul: data.publications.map(publication => [
            {
              text: `${publication.title} (${publication.date_published})`,
              style: 'title'
            },
            publication.description,
            {
              text: 'Authors: ' + publication.authors.join(', '),
              style: 'authors'
            },
            {
              text: 'Publication Link: \n' + publication.publication_link.replace(/\\n/g, '')
            },
          ]),
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        title: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        authors: {
          italic: true,
        },
      },
    };

    return docDefinition;
  }
}