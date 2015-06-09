/**
 * Created by huanli<huali@tibco-support.com> on 12/13/14.
 *
 * Variable prefixes' meanings:
 * -------------------------------------------------------------------------
 * --- The prefix of a variable's name reveals the type of data it holds ---
 * -------------------------------------------------------------------------
 *
 * a: Array
 * b: Boolean
 * d: DOM
 * f: Function
 * l: List(an array-like object)
 * n: Number
 * o: Object
 * r: Regular expression
 * s: String
 * x: More than one type
 *  : Special case or NOT my code
 *
 * *** These prefixes can be concatenated to indicate that the variable can
 *         hold the specified types of data ***
 */

(function () {
    'use strict';

    var gulp = require('gulp'),
        minifycss = require('gulp-minify-css'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        del = require('del');


    gulp.task('build', function () {

        var fs=require('fs');

        fs.readFile('views/index_debug.html','utf-8',function(err,data){
            if(!err){
                var cheerio=require('cheerio');
                var $=cheerio.load(data);
                var arr=[];
                $('script').each(function(i,elem){
                    if(typeof(elem.attribs.src)!=='undefined'){
                        arr.push('public'+elem.attribs.src);
                        console.log('elem is:',elem.attribs.src);
                    }

                })
                console.log('arr is:',arr);

                gulp.src(arr).pipe(concat('main.js'))
                    .pipe(gulp.dest('public/minified/js'))
                    .pipe(rename({suffix: '.min'}))
                    .pipe(uglify())
                    .pipe(gulp.dest('public/minified/js'));


            }
        })



        //return
    });

    }());
