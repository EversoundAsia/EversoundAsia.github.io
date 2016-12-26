/*
 * Sticky HTML5 Music Player With Continuous Playback v1.8.1
 *
 * Copyright 2014-2016, LambertGroup
 * 
 */

(function($) {
	
	//vars	
	var val = navigator.userAgent.toLowerCase();
	
	function supports_mp3_audio(current_obj) {
			  var a = document.getElementById(current_obj.audioID);
			  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	}
	
	function getOSandVer(current_obj)
		{
		  var ua = navigator.userAgent;
		  var uaindex;
		  var lastCharacter;
		  //alert (ua);
		
		  // determine OS
		  if ( ua.match(/iPad/i) || ua.match(/iPhone/i) )
		  {
			current_obj.userOS = 'iOS';
			uaindex = ua.indexOf( 'OS ' );
		  }
		  else if ( ua.match(/Android/i) )
		  {
			current_obj.userOS = 'Android';
			uaindex = ua.indexOf( 'Android ' );
		  }
		  else
		  {
			current_obj.userOS = 'unknown';
		  }
		
		  // determine version
		  if ( current_obj.userOS === 'iOS'  &&  uaindex > -1 )
		  {
			current_obj.userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
			/*lastCharacter = current_obj.userOSver.charAt(current_obj.userOSver.length - 1);
			if (lastCharacter=='.') {
				current_obj.userOSver=current_obj.userOSver.substr(0,2);
			}*/
			//alert (current_obj.userOSver);
		  }
		  else if ( current_obj.userOS === 'Android'  &&  uaindex > -1 )
		  {
			current_obj.userOSver = ua.substr( uaindex + 8, 3 );
		  }
		  else
		  {
			current_obj.userOSver = 'unknown';
		  }
		}
		
	//functions	
	function detectBrowserAndAudio(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container) {
				//activate current
				//$(thumbsHolder_Thumbs[current_obj.current_img_no]).addClass('thumbsHolder_ThumbON');
				$(thumbsHolder_Thumbs[current_obj.current_img_no]).css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});
				
				//auto scroll carousel if needed
				carouselScroll(-1,current_obj,options,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder);
				
				var currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
				
				//alert (val);
				if (val.indexOf("opera") != -1 || val.indexOf("opr") != -1 || val.indexOf("firefox") != -1  || val.indexOf("mozzila") != -1) {
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_ogg'];
					if (supports_mp3_audio(current_obj)!='') {
						currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
					}
				}
					
				if (val.indexOf("chrome") != -1 || val.indexOf("msie") != -1 || val.indexOf("safari") != -1) {
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
					if (val.indexOf("opr") != -1) {
						currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_ogg'];
						if (supports_mp3_audio(current_obj)!='') {
							currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
						}	
					}
				}
					
				if (val.indexOf("android") != -1)
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];				
				
				if (current_obj.userOS === 'iOS')
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];

				//alert (currentAudio+ '  --  ' +val);
				return currentAudio;
			};			
	
	function changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_Audio) {

				current_obj.totalTime = 'Infinity';
				//seekbar init
				if (options.isSliderInitialized) {
					audio3_html5_Audio_seek.slider("destroy");
					options.isSliderInitialized=false;
				}
				if (options.isProgressInitialized) {
					audio3_html5_Audio_buffer.progressbar("destroy");
					options.isProgressInitialized=false;
				}
				//audio3_html5_Audio.unbind('progress');
				current_obj.is_changeSrc=true;
				current_obj.is_buffer_complete=false;
				
				//current_obj.totalTimeInterval='Infinity';
				
				//audio3_html5_AuthorTitle init
				audio3_html5_AuthorTitle.width(current_obj.audioPlayerWidth);
				audio3_html5_Audio_buffer.css({'background':options.bufferEmptyColor});
				
				//.each(function(){ alert ("aaaa"); });
				

				
				current_obj.curSongText='';
				if (options.showAuthor && current_obj.playlist_arr[current_obj.current_img_no]['author']!=null && current_obj.playlist_arr[current_obj.current_img_no]['author']!='') {
	            	current_obj.curSongText+=current_obj.playlist_arr[current_obj.current_img_no]['author']+' - ';
				}				       
				if (options.showTitle && current_obj.playlist_arr[current_obj.current_img_no]['title']!=null && current_obj.playlist_arr[current_obj.current_img_no]['title']!='') {
	            	current_obj.curSongText+=current_obj.playlist_arr[current_obj.current_img_no]['title'];
	            }
				current_obj.isAuthorTitleInsideScrolling=false;
				current_obj.authorTitleInsideWait=0;
				audio3_html5_AuthorTitleInside.stop();
				audio3_html5_AuthorTitleInside.css({'margin-left':0});	
				audio3_html5_AuthorTitleInside.html(current_obj.curSongText);
					
				if (!current_obj.curSongText) {
					audio3_html5_AuthorTitle.addClass('cancelDiv');
				} else {
					audio3_html5_AuthorTitle.removeClass('cancelDiv');
				}
					
				
				//audio3_html5_Audio.type='audio/ogg; codecs="vorbis"';
				document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container);
				document.getElementById(current_obj.audioID).load();
				
				//alert (audio3_html5_Audio.type );
				
				
				if (val.indexOf("android") != -1) {
					//nothing
				} else if ( current_obj.userOS === 'iOS' && current_obj.is_very_first) {
					//nothing
				} else {
					//alert ("start: "+options.autoPlay);
					///////if (val.indexOf("opera") != -1) {//firefox >31.0
						if (options.autoPlay) {
							cancelAll();
							document.getElementById(current_obj.audioID).play();
							//audio3_html5_play_btn.click();
							audio3_html5_play_btn.addClass('AudioPause');
						}/* else { //firefox >31.0
							audio3_html5_play_btn.removeClass('AudioPause');
						}
					}*/
				}

			};
			
			


			function FormatTime(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};

        



			function generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio) {
				//alert ("gen: "+document.getElementById(current_obj.audioID).readyState);
					current_obj.is_changeSrc=false;
					if (current_obj.is_very_first)
						current_obj.is_very_first=false;
					//initialize the seebar
					//alert (current_obj.audioPlayerWidth);
			    audio3_html5_Audio_buffer.width(current_obj.audioPlayerWidth);
					audio3_html5_Audio_seek.width(current_obj.audioPlayerWidth);
					
					audio3_html5_Audio_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: current_obj.totalTime,
						//animate: true,					
						slide: function(){							
							current_obj.is_seeking = true;
						},
						stop:function(e,ui){
							current_obj.is_seeking = false;						
							document.getElementById(current_obj.audioID).currentTime=ui.value;
							if(document.getElementById(current_obj.audioID).paused != false) {
								document.getElementById(current_obj.audioID).play();
								audio3_html5_play_btn.addClass('AudioPause');				
							}
							
						},
						create: function( e, ui ) {
							options.isSliderInitialized=true;
						}
					});
					$(".ui-slider-range",audio3_html5_Audio_seek).css({'background':options.seekbarColor});
					
					
					
					var bufferedTime=0;
					audio3_html5_Audio_buffer.progressbar({ 
						value: bufferedTime,
						complete: function(){							
							current_obj.is_buffer_complete=true;
						},
						create: function( e, ui ) {
							options.isProgressInitialized=true;
						}
					});
					$(".ui-widget-header",audio3_html5_Audio_buffer).css({'background':options.bufferFullColor});
			

				
			};

			
		
			
			function seekUpdate(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside) {
				if (!current_obj.isAuthorTitleInsideScrolling && current_obj.authorTitleInsideWait>=5 && audio3_html5_AuthorTitleInside.width()>current_obj.audioPlayerWidth && !current_obj.isMinimized) {
					current_obj.isAuthorTitleInsideScrolling=true;
					current_obj.authorTitleInsideWait=0;
					audio3_html5_AuthorTitleInside.html(current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** ");
					audio3_html5_AuthorTitleInside.css({'margin-left':0});	
					audio3_html5_AuthorTitleInside.stop().animate({
							'margin-left':(current_obj.audioPlayerWidth-audio3_html5_AuthorTitleInside.width())+'px'
					 }, parseInt((audio3_html5_AuthorTitleInside.width()-current_obj.audioPlayerWidth)*10000/150,10), 'linear', function() {
							// Animation complete.
							  current_obj.isAuthorTitleInsideScrolling=false;
					});
				} else if (!current_obj.isAuthorTitleInsideScrolling && audio3_html5_AuthorTitleInside.width()>current_obj.audioPlayerWidth) {
					current_obj.authorTitleInsideWait++;
				}
				
				//update time
				curTime = document.getElementById(current_obj.audioID).currentTime;
				bufferedTime=0;
				if (current_obj.is_changeSrc && !isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity') {
					//alert (current_obj.totalTime);
					generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio);
					if (val.indexOf("android") != -1) {
						if (options.autoPlay) {
							document.getElementById(current_obj.audioID).play();
							//audio3_html5_play_btn.click();
							audio3_html5_play_btn.addClass('AudioPause');
						} else {
							audio3_html5_play_btn.removeClass('AudioPause');
						}
					}
				}
					
						
						//update seekbar
						if(!current_obj.is_seeking && options.isSliderInitialized)
							audio3_html5_Audio_seek.slider('value', curTime);
						
						//the buffer	
						if (val.indexOf("android") != -1) {
							//fix duration android 4 start
							if (current_obj.totalTime!=document.getElementById(current_obj.audioID).duration && document.getElementById(current_obj.audioID).duration>0) {
								current_obj.totalTime=document.getElementById(current_obj.audioID).duration;
								//seekbar init
								if (options.isSliderInitialized) {
									audio3_html5_Audio_seek.slider("destroy");
									options.isSliderInitialized=false;
								}
								if (options.isProgressInitialized) {
									audio3_html5_Audio_buffer.progressbar("destroy");
									options.isProgressInitialized=false;
								}								
								generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio);
							}
							//fix duration android 4 start									
							
							audio3_html5_Audio_buffer.css({'background':options.bufferFullColor});
							if (!isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity')
								audio3_html5_Audio_timer.text(FormatTime(curTime)+' / '+FormatTime(current_obj.totalTime));
							else
								audio3_html5_Audio_timer.text('00:00 / '+FormatTime(0));	
						} else {
								if (document.getElementById(current_obj.audioID).buffered.length) {
									bufferedTime = document.getElementById(current_obj.audioID).buffered.end(document.getElementById(current_obj.audioID).buffered.length-1); 
									//alert (current_obj.totalTime + ' > '+bufferedTime);
									if (bufferedTime>0 && !current_obj.is_buffer_complete && !isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity' && options.isProgressInitialized) {
										audio3_html5_Audio_buffer.progressbar({ value: bufferedTime*100/current_obj.totalTime });
										//alert (bufferedTime+' -- '+current_obj.audioPlayerWidth);
									}
								}
								audio3_html5_Audio_timer.text(FormatTime(curTime)+' / '+FormatTime(bufferedTime));
						}
						setCookie(options,'cookie_timePlayed', curTime);

				/*} else {
					audio3_html5_Audio_timer.text('00:00 / '+FormatTime(0));
				}*/
				
					
					
			};
			
			
			function endAudioHandler(current_obj,options,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_next_btn,audio3_html5_Audio) {
		        if (options.loop) {
					audio3_html5_next_btn.click();
		        }
		    }		
			
			
		//playlist scroll
		function carouselScroll(direction,current_obj,options,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder) {
				var MAX_TOP=(thumbsHolder_Thumb.height()+1)*(current_obj.total_images-options.numberOfThumbsPerScreen);
				//alert (audio3_html5_sliderVertical.slider( "option", "animate" ));
				audio3_html5_thumbsHolder.stop(true,true);
				if (direction!=-1 && !current_obj.isCarouselScrolling) {
					current_obj.isCarouselScrolling=true;
					
					if (direction<=1)
						direction=0;
					new_top=((direction<=2)?(-1)*MAX_TOP:parseInt(MAX_TOP*(direction-100)/100,10));
					if (new_top>0) {
						new_top=0;
					}
									
					audio3_html5_thumbsHolder.animate({
					    //opacity: 1,
					    //top:parseInt(MAX_TOP*(direction-100)/100,10)+'px'
						top:new_top+'px'
					  }, 1100, 'easeOutQuad', function() {
					    // Animation complete.
						  current_obj.isCarouselScrolling=false;
					});
				} else if (!current_obj.isCarouselScrolling && current_obj.total_images>options.numberOfThumbsPerScreen) {
					current_obj.isCarouselScrolling=true;
					//audio3_html5_thumbsHolder.css('opacity','0.5');			
					var new_top=(-1)*parseInt((thumbsHolder_Thumb.height()+1)*current_obj.current_img_no,10);
					if( Math.abs(new_top) > MAX_TOP ){ new_top = (-1)*MAX_TOP; }		
					if (current_obj.total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {			
						audio3_html5_sliderVertical.slider( "value" , 100 + parseInt( new_top * 100 / MAX_TOP ) );
					}
					audio3_html5_thumbsHolder.animate({
					    //opacity: 1,
					    top:new_top+'px'
					  }, 500, 'easeOutCubic', function() {
					    // Animation complete.
						  current_obj.isCarouselScrolling=false;
					});
				}
			};
			
			
			function generateAudioPlayer (current_obj,audio3_html5_Audio,audio3_html5_rewind_btn,audio3_html5_play_btn,audio3_html5_prev_btn,audio3_html5_next_btn,audio3_html5_shuffle_btn,audio3_html5_volumeMute_btn,audio3_html5_volumeSlider,audio3_html5_Audio_timer,audio3_html5_Audio_buffer,audio3_html5_Audio_seek,audio3_html5_AuthorTitle,audio3_html5_controls,audio3_html5_border,audio3_html5_container,audio3_html5_thumbsHolderWrapper,audio3_html5_AuthorTitleInside,audio3_html5_sliderVertical,audio3_closeBut,ver_ie,options,playerPadding,showRewindBut,showPlayBut,showPreviousBut,showNextBut,showShuffleBut,showVolumeBut,showVolumeSliderBut,showTimer,showSeekBar,showAuthor,showTitle,showPlaylist,showPlaylistOnInit) {
					//initilize the player with the options
					audio3_html5_container.css({
						'background':options.playerBg,
						'padding':playerPadding+'px'
					});
					
					
					if ( current_obj.userOS === 'iOS' ) {
						//audio3_html5_controls.css({margin-top:-20px;});
						if (current_obj.isMinimized) {
							audio3_html5_container.css({
								'padding-top':'0px'
							});	/**/						
						} else {
							/*audio3_html5_container.css({
								'padding-top':'0px'
							});*/
						}
					}				
				
				
					current_obj.audioPlayerWidth=0;
						
	//current_obj.origVolumeButMarginTop
					if (current_obj.isMinimized) {
						audio3_html5_play_btn.css({
							'margin-top':0+'px',
							'margin-bottom':0+'px',
							'margin-left':0+'px'/*,
							'margin-right':0+'px',*/
						});	
						audio3_html5_volumeMute_btn.css({
							'margin-top':parseInt((audio3_html5_play_btn.height()-audio3_html5_volumeMute_btn.height())/2,10)+'px',
							'margin-bottom':0+'px'/*,
							'margin-left':0+'px',
							'margin-right':0+'px',*/
						});
						audio3_html5_volumeSlider.css({
							'margin-top':parseInt((audio3_html5_play_btn.height()-audio3_html5_volumeSlider.height())/2,10)+'px',
							'margin-bottom':0+'px',
							/*'margin-left':0+'px',*/
							'margin-right':0+'px'
						});
						
					} else {
						audio3_html5_play_btn.css({
							'margin-top':current_obj.origPlayButMarginTop,
							'margin-bottom':current_obj.origPlayButMarginBottom,
							'margin-left':current_obj.origPlayButMarginLeft/*,
							'margin-right':current_obj.origPlayButMarginRight*/
						});
						audio3_html5_volumeMute_btn.css({
							'margin-top':current_obj.origVolumeButMarginTop,
							'margin-bottom':current_obj.origVolumeButMarginBottom/*,
							'margin-left':current_obj.origVolumeButMarginLeft,
							'margin-right':current_obj.origVolumeButMarginRight*/
						});						
						audio3_html5_volumeSlider.css({
							'margin-top':current_obj.origVolumeSliderMarginTop,
							'margin-bottom':current_obj.origVolumeSliderMarginBottom,
							/*'margin-left':current_obj.origVolumeSliderMarginLeft,*/
							'margin-right':current_obj.origVolumeSliderMarginRight
						});							
						
					}/**/	
					
					
					if (!showRewindBut) {				
						audio3_html5_rewind_btn.addClass('cancelDiv');
					} else {
						audio3_html5_rewind_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_rewind_btn.width() + parseInt(audio3_html5_rewind_btn.css('margin-left').substring(0, audio3_html5_rewind_btn.css('margin-left').length-2)) + parseInt(audio3_html5_rewind_btn.css('margin-right').substring(0, audio3_html5_rewind_btn.css('margin-right').length-2));
					}
						
					if (!showPlayBut) {
						audio3_html5_play_btn.addClass('cancelDiv');
					} else {
						audio3_html5_play_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_play_btn.width() + parseInt(audio3_html5_play_btn.css('margin-left').substring(0, audio3_html5_play_btn.css('margin-left').length-2)) + parseInt(audio3_html5_play_btn.css('margin-right').substring(0, audio3_html5_play_btn.css('margin-right').length-2));
					}
						
					if (!showPreviousBut) {
						audio3_html5_prev_btn.addClass('cancelDiv');
					} else {
						audio3_html5_prev_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_prev_btn.width() + parseInt(audio3_html5_prev_btn.css('margin-left').substring(0, audio3_html5_prev_btn.css('margin-left').length-2)) + parseInt(audio3_html5_prev_btn.css('margin-right').substring(0, audio3_html5_prev_btn.css('margin-right').length-2));
					}
						
					if (!showNextBut) {
						audio3_html5_next_btn.addClass('cancelDiv');
					} else {
						audio3_html5_next_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_next_btn.width() + parseInt(audio3_html5_next_btn.css('margin-left').substring(0, audio3_html5_next_btn.css('margin-left').length-2)) + parseInt(audio3_html5_next_btn.css('margin-right').substring(0, audio3_html5_next_btn.css('margin-right').length-2));
					}
						
					if (!showShuffleBut) {
						audio3_html5_shuffle_btn.addClass('cancelDiv');
					} else {
						audio3_html5_shuffle_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_shuffle_btn.width() + parseInt(audio3_html5_shuffle_btn.css('margin-left').substring(0, audio3_html5_shuffle_btn.css('margin-left').length-2)) + parseInt(audio3_html5_shuffle_btn.css('margin-right').substring(0, audio3_html5_shuffle_btn.css('margin-right').length-2));
					}
						
					if (!showVolumeBut) {
						audio3_html5_volumeMute_btn.addClass('cancelDiv');
					} else {
						audio3_html5_volumeMute_btn.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_volumeMute_btn.width() + parseInt(audio3_html5_volumeMute_btn.css('margin-left').substring(0, audio3_html5_volumeMute_btn.css('margin-left').length-2)) + parseInt(audio3_html5_volumeMute_btn.css('margin-right').substring(0, audio3_html5_volumeMute_btn.css('margin-right').length-2));
					}
						
					if (!showVolumeSliderBut) {
						audio3_html5_volumeSlider.addClass('cancelDiv');
					} else {
						audio3_html5_volumeSlider.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_volumeSlider.width() + parseInt(audio3_html5_volumeSlider.css('margin-left').substring(0, audio3_html5_volumeSlider.css('margin-left').length-2)) + parseInt(audio3_html5_volumeSlider.css('margin-right').substring(0, audio3_html5_volumeSlider.css('margin-right').length-2));
					}
						
					if (!showTimer) {				
						audio3_html5_Audio_timer.addClass('cancelDiv');
					} else {
						audio3_html5_Audio_timer.removeClass('cancelDiv');
						current_obj.audioPlayerWidth+=audio3_html5_Audio_timer.width() + parseInt(audio3_html5_Audio_timer.css('margin-left').substring(0, audio3_html5_Audio_timer.css('margin-left').length-2)) + parseInt(audio3_html5_Audio_timer.css('margin-right').substring(0, audio3_html5_Audio_timer.css('margin-right').length-2));
					}
						
					if (!showSeekBar) {
						audio3_html5_Audio_buffer.css ({
							'display':'none'
						});
						audio3_html5_Audio_seek.css ({
							'display':'none'
						});
					} else {
						audio3_html5_Audio_buffer.css ({
							'display':'block'
						});
						audio3_html5_Audio_seek.css ({
							'display':'block'
						});
					}
					

					audio3_html5_Audio_timer.css({'color':options.timerColor});
					audio3_html5_AuthorTitle.css({'color':options.songAuthorTitleColor});
					
						
		

					//current_obj.audioPlayerWidth=audio3_html5_container.width()-10;
					//current_obj.audioPlayerWidth=audio3_html5_container.width()-10-widthAdjust;	
					if (/*ver_ie!=-1 || val.indexOf("android") != -1 || */current_obj.userOS === 'iOS') {
						if ( Number( current_obj.userOSver ) < 8 ) {
							current_obj.audioPlayerWidth-=9;
						}
					} else {
							current_obj.audioPlayerWidth-=9;	
					}
					
					//options.playlistTopPos=0;
					if (val.indexOf("android") != -1) {
						options.playlistTopPos-=0;
					} else if (current_obj.userOS === 'iOS') {
						if (current_obj.isMinimized) {
							if ( Number( current_obj.userOSver ) < 8 ) {
								audio3_html5_controls.css('margin-top','-14px');
							} else {
								audio3_html5_controls.css('margin-top','2px');
							}
						} else {
							if ( Number( current_obj.userOSver ) < 8 ) {
								audio3_html5_controls.css('margin-top','-16px');
								options.playlistTopPos-=5;
							} else {
								audio3_html5_controls.css('margin-top','-2px');
								/*options.playlistTopPos-=5;*/
							}
						}
					}
					/*if (!showAuthor && !showTitle) {
						options.playlistTopPos-=0;
					}		
					if (showSeekBar && !showAuthor && !showTitle) {
						options.playlistTopPos-=0;
					}*/
								
					
					audio3_html5_AuthorTitle.width(current_obj.audioPlayerWidth);
					audio3_html5_border.width(current_obj.audioPlayerWidth+10);		
					
					
					
					
					
					//alert (current_obj.audioPlayerHeight);
					if (current_obj.audioPlayerHeight>0) {
						if (!current_obj.isMinimized) {
							audio3_html5_container.height(current_obj.audioOrigPlayerHeight-2*playerPadding);	
							current_obj.audioPlayerHeight=current_obj.audioOrigPlayerHeight;
						} else {
							audio3_html5_container.height(audio3_html5_play_btn.height());	
							current_obj.audioPlayerHeight=audio3_html5_container.height()+2*playerPadding;
						}
						//alert (playerPadding);
					} else { //first time
						current_obj.audioPlayerHeight=audio3_html5_container.height()+2*playerPadding;
						current_obj.audioOrigPlayerHeight=current_obj.audioPlayerHeight;
					}
					//alert (audio3_html5_container.height()+'  --  '+current_obj.audioPlayerHeight);						
					
					//audio3_html5_border.height(current_obj.audioPlayerHeight);
					if (!showSeekBar) {
						/*if (val.indexOf("android") != -1) {
							audio3_html5_border.height(audio3_html5_container.height()-24);
						} else if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
							audio3_html5_border.height(audio3_html5_container.height()-18);
						} else if (ver_ie!=-1) {
							audio3_html5_border.height(audio3_html5_container.height()-24);
						} else if (val.indexOf("opera") != -1) {
							audio3_html5_border.height(audio3_html5_container.height()-24);
						} else {
							audio3_html5_border.height(audio3_html5_container.height()-4);
						}*/
						if (!current_obj.isMinimized) {
							audio3_html5_border.height(current_obj.audioPlayerHeight-4);
						}
					} else {
						if (!current_obj.isMinimized) {
							generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio);	
						}
					}
					

					
				

					
					if (!showAuthor && !showTitle) {
						if (!current_obj.isMinimized) {
							audio3_html5_border.height(current_obj.audioPlayerHeight-22);
						}
						audio3_html5_AuthorTitleInside.css ({
							'display':'none'
						});
					} else {
						audio3_html5_AuthorTitleInside.css ({
							'display':'block'
						});		
					}					
					
					if (!showPlaylist) {
						audio3_html5_thumbsHolderWrapper.css({'display':'none'});
					} else {
						audio3_html5_thumbsHolderWrapper.css({'display':'block'});
					}
					
					if (!showPlaylistOnInit) {
						audio3_html5_thumbsHolderWrapper.addClass('cancelThumbsHolderWrapper');
					} else {
						audio3_html5_thumbsHolderWrapper.removeClass('cancelThumbsHolderWrapper');					
					}
					
					
					if (current_obj.total_images>options.numberOfThumbsPerScreen && showPlaylist) {
						audio3_html5_sliderVertical.css({
							'display':'inline'
						});
					} else {
						audio3_html5_sliderVertical.css({
							'display':'none'
						});						
					}
					
					
					
					if (current_obj.isMinimized) {
							audio3_closeBut.addClass('AudioOpenBut');
							audio3_closeBut.css({
								'right':-audio3_closeBut.width()-1+'px',
								'margin-top':0+'px'
							});	
							if (current_obj.userOS === 'iOS') {
								audio3_closeBut.height(current_obj.origCloseButHeight-3);
							}
					} else {
							audio3_closeBut.removeClass('AudioOpenBut');
							audio3_closeBut.css({
								'right':current_obj.origCloseButRight,
								'margin-top':current_obj.origCloseButMarginTop
							});							
					}
					
			}


			function setCookie(options,c_name,value,exdays)
			{
				if (options.continuouslyPlayOnAllPages) {
					var exdate=new Date();
					exdate.setDate(exdate.getDate() + exdays);
					var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString())+";path=/";
					document.cookie=c_name + "=" + c_value;
				}
			}
			
			function getCookie(options,c_name)
			{
				if (options.continuouslyPlayOnAllPages) {	
					var i,x,y,ARRcookies=document.cookie.split(";");
					for (i=0;i<ARRcookies.length;i++)
					{
					  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
					  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
					  x=x.replace(/^\s+|\s+$/g,"");
					  if (x==c_name)
						{
						return unescape(y);
						}
					  }
				}
			}


			function getRandomNumber(options,current_obj)
			{
				var new_current_img_no=Math.ceil(Math.random() * (current_obj.total_images-1));
				if (new_current_img_no!=current_obj.current_img_no) {
					current_obj.current_img_no=new_current_img_no;
				} else {
					current_obj.current_img_no=Math.ceil(Math.random() * (current_obj.total_images-1));
				}
			}
			
			function positionPlayer(options,current_obj,audio3_html5_bottom_div,audio3_html5_thumbsHolderWrapper,audio3_closeBut) {
				var closeButWidth=audio3_closeBut.width()+1;
				if (!current_obj.isMinimized)
					closeButWidth=0
				current_obj.playerNewLeft='0px';
				current_obj.playerMarginLeft=0;
				switch(options.playerPossition) {
					case 'left':
						current_obj.playerNewLeft=options.playerAdditionalLeftMargin+'px';
						break;
					case 'center':
						current_obj.playerNewLeft='50%';
						current_obj.playerMarginLeft=(-1)*(audio3_html5_bottom_div.width()+closeButWidth)/2+options.playerAdditionalLeftMargin;
						break;
					case 'right':
						current_obj.playerNewLeft='100%';
						current_obj.playerMarginLeft=(-1)*audio3_html5_bottom_div.width()-closeButWidth-options.playerAdditionalLeftMargin;
						break;				
					default:
						current_obj.playerNewLeft=0;
						current_obj.playerMarginLeft=options.playerAdditionalLeftMargin;
				} 			
			}


			function getInternetExplorerVersion()
			// -1 - not IE
			// 7,8,9 etc
			{
			   var rv = -1; // Return value assumes failure.
			   if (navigator.appName == 'Microsoft Internet Explorer')
			   {
				  var ua = navigator.userAgent;
				  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				  if (re.exec(ua) != null)
					 rv = parseFloat( RegExp.$1 );
			   }
			   return parseInt(rv,10);
			}

			function cancelAll() {
				//alert ($("audio").attr('id'));
				//$("audio")[0].pause();				
				$("audio").each(function() {
					$('.AudioPlay').removeClass('AudioPause');
					$(this)[0].pause();
				});				
			}

		
		
	//core
	$.fn.audio3_html5 = function(options) {
		
		var options = $.extend({},$.fn.audio3_html5.defaults, options);
		//parse it
		return this.each(function() {
			var audio3_html5_Audio = $(this);
		
			
			//the controllers
			var audio3_html5_controlsDef = $('<div class="AudioControls"> <a class="AudioRewind" title="Rewind"></a><a class="AudioPrev" title="Previous"></a><a class="AudioPlay" title="Play/Pause"></a><a class="AudioNext" title="Next"></a><a class="AudioShuffle" title="Shuffle"></a><a class="VolumeButton" title="Mute/Unmute"></a><div class="VolumeSlider"></div> <div class="AudioTimer">00:00 / 00:00</div>  </div>   <div class="AudioBuffer"></div><div class="AudioSeek"></div><div class="songAuthorTitle"><div class="songAuthorTitleInside">AA</div></div>    <div class="thumbsHolderWrapper"><div class="playlistPadding"><div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div></div></div>  <div class="slider-vertical"></div>');						
		    var audio3_closeBut=$('<div class="AudioCloseBut"></div>');
					
			
			//the elements
			var audio3_html5_container = audio3_html5_Audio.parent('.audio3_html5');
			var audio3_html5_border = $(this).parent();
			var audio3_html5_bottom_div = audio3_html5_container.parent('.audio3_html5_bottom_div');
			audio3_html5_bottom_div.append(audio3_closeBut);
			audio3_html5_bottom_div.addClass(options.skin);
			
			

			audio3_html5_container.addClass(options.skin);
			audio3_html5_container.append(audio3_html5_controlsDef);					
			
			var audio3_html5_controls = $('.AudioControls', audio3_html5_container);
			var audio3_html5_rewind_btn = $('.AudioRewind', audio3_html5_container);
			var audio3_html5_play_btn = $('.AudioPlay', audio3_html5_container);
			var audio3_html5_prev_btn = $('.AudioPrev', audio3_html5_container);
			var audio3_html5_next_btn = $('.AudioNext', audio3_html5_container);			
			var audio3_html5_shuffle_btn = $('.AudioShuffle', audio3_html5_container);
			var audio3_html5_volumeMute_btn = $('.VolumeButton', audio3_html5_container);
			var audio3_html5_volumeSlider = $('.VolumeSlider', audio3_html5_container);
			var audio3_html5_Audio_timer = $('.AudioTimer', audio3_html5_container);
			var audio3_html5_AuthorTitle = $('.songAuthorTitle', audio3_html5_container);
			var audio3_html5_AuthorTitleInside = $('.songAuthorTitleInside', audio3_html5_container);
			
			
			var audio3_html5_Audio_buffer = $('.AudioBuffer', audio3_html5_container);
			var audio3_html5_Audio_seek = $('.AudioSeek', audio3_html5_container);
			
			//playlist
			var currentCarouselTop=0;
			var audio3_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio3_html5_container);
			var audio3_html5_playlistPadding = $('.playlistPadding', audio3_html5_container);
			var audio3_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio3_html5_container);
			var audio3_html5_thumbsHolder = $('.thumbsHolder', audio3_html5_container);
			var audio3_html5_sliderVertical = $('.slider-vertical', audio3_html5_container);			
			
			var ver_ie=getInternetExplorerVersion();
			
			
			

			
		    /*playlist_arr:'',
            	timeupdateInterval:'',
				totalTime:'',
				isCarouselScrolling:false,
				isAuthorTitleInsideScrolling:false,
				curSongText:'',
				authorTitleInsideWait:0,
			*/
			var current_obj = {
				current_img_no:0,
				is_very_first:true,
				total_images:0,
				is_seeking:false,
				is_changeSrc:false,
				is_buffer_complete:true,

				audioPlayerWidth:0,
				audioPlayerHeight:0,
				audioOrigPlayerHeight:0,
				audioID:'',
				audioObj:'',
				cookie_timePlayed:0,
				cookie_current_img_no:0,
				cookie_initialVolume:0,
				cookie_muteVolume:0,
				cookie_autoPlay:false,
				cookie_shuffle:false,
				isMinimized:false,
				playerNewLeft:0,
				playerMarginLeft:0,
				closeTime:10,
				origPlayButMarginTop:0,
				origPlayButMarginBottom:0,
				origPlayButMarginLeft:0,
				origPlayButMarginRight:0,
				origVolumeButMarginTop:0,
				origVolumeButMarginBottom:0,
				origVolumeButMarginLeft:0,
				origVolumeButMarginRight:0,
				origVolumeSliderMarginTop:0,
				origVolumeSliderMarginBottom:0,
				origVolumeSliderMarginLeft:0,
				origVolumeSliderMarginRight:0,
				origCloseButMarginTop:0,
				origCloseButRight:0,
				origCloseButHeight:0,
				userOS:'',
				userOSver:0
			};
			current_obj.audioID=audio3_html5_Audio.attr('id');	
			
			current_obj.origPlayButMarginTop=audio3_html5_play_btn.css('margin-top');
			current_obj.origPlayButMarginBottom=audio3_html5_play_btn.css('margin-bottom');
			current_obj.origPlayButMarginLeft=audio3_html5_play_btn.css('margin-left');
			current_obj.origPlayButMarginRight=audio3_html5_play_btn.css('margin-right');		
			

			current_obj.origVolumeButMarginTop=audio3_html5_volumeMute_btn.css('margin-top');
			current_obj.origVolumeButMarginBottom=audio3_html5_volumeMute_btn.css('margin-bottom');
			current_obj.origVolumeButMarginLeft=audio3_html5_volumeMute_btn.css('margin-left');
			current_obj.origVolumeButMarginRight=audio3_html5_volumeMute_btn.css('margin-right');	
			

			current_obj.origVolumeSliderMarginTop=audio3_html5_volumeSlider.css('margin-top');
			current_obj.origVolumeSliderMarginBottom=audio3_html5_volumeSlider.css('margin-bottom');
			current_obj.origVolumeSliderMarginLeft=audio3_html5_volumeSlider.css('margin-left');
			current_obj.origVolumeSliderMarginRight=audio3_html5_volumeSlider.css('margin-right');	
			
			
			current_obj.origCloseButMarginTop=audio3_closeBut.css('margin-top');
			current_obj.origCloseButRight=audio3_closeBut.css('right');
			audio3_closeBut.addClass('AudioOpenBut');
			current_obj.origCloseButHeight=audio3_closeBut.height();
			audio3_closeBut.removeClass('AudioOpenBut');
						
			audio3_closeBut.css({
				'background-color':options.playerBg
			});
			
			//get OS and version
			getOSandVer(current_obj);
			//alert (current_obj.userOS + '  --  ' + current_obj.userOSver);
			
			
			generateAudioPlayer (current_obj,audio3_html5_Audio,audio3_html5_rewind_btn,audio3_html5_play_btn,audio3_html5_prev_btn,audio3_html5_next_btn,audio3_html5_shuffle_btn,audio3_html5_volumeMute_btn,audio3_html5_volumeSlider,audio3_html5_Audio_timer,audio3_html5_Audio_buffer,audio3_html5_Audio_seek,audio3_html5_AuthorTitle,audio3_html5_controls,audio3_html5_border,audio3_html5_container,audio3_html5_thumbsHolderWrapper,audio3_html5_AuthorTitleInside,audio3_html5_sliderVertical,audio3_closeBut,ver_ie,options,options.playerPadding,options.showRewindBut,options.showPlayBut,options.showPreviousBut,options.showNextBut,options.showShuffleBut,options.showVolumeBut,options.showVolumeSliderBut,options.showTimer,options.showSeekBar,options.showAuthor,options.showTitle,options.showPlaylist,options.showPlaylistOnInit);
			
		
			
			
			//generate playlist
			/*var currentCarouselTop=0;
			var audio3_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio3_html5_container);
			var audio3_html5_playlistPadding = $('.playlistPadding', audio3_html5_container);
			var audio3_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio3_html5_container);
			var audio3_html5_thumbsHolder = $('.thumbsHolder', audio3_html5_container);
			var audio3_html5_sliderVertical = $('.slider-vertical', audio3_html5_container);*/
			
			

			audio3_html5_thumbsHolderWrapper.css({
				'width':audio3_html5_container.width()+2*options.playerPadding+'px',
				'top':current_obj.audioPlayerHeight+options.playlistTopPos+'px',
				'left':'0px',
				'background':options.playlistBgColor
				
			});
			
			audio3_html5_thumbsHolderVisibleWrapper.width(audio3_html5_container.width()+1+2*options.playerPadding);

			
			current_obj.playlist_arr=new Array();
			
			var playlistElements = $('.xaudioplaylist', audio3_html5_container).children();
			playlistElements.each(function() { // ul-s
	            currentElement = $(this);
	            current_obj.total_images++;
	            current_obj.playlist_arr[current_obj.total_images-1]=new Array();
	            current_obj.playlist_arr[current_obj.total_images-1]['title']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['author']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['thumb']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']='';
	            
	            //alert (currentElement.find('.xtitle').html())
	           if (currentElement.find('.xtitle').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['title']=currentElement.find('.xtitle').html();
	            }	            
	            
	            if (currentElement.find('.xauthor').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['author']=currentElement.find('.xauthor').html();
	            }
	            
	            if (currentElement.find('.xthumb').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['thumb']=currentElement.find('.xthumb').html();
	            }
	            
	            if (currentElement.find('.xsources_mp3').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']=currentElement.find('.xsources_mp3').html();
	            }	  
	            
	            if (currentElement.find('.xsources_ogg').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']=currentElement.find('.xsources_ogg').html();
	            }
					
	            
				thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ (current_obj.total_images-1) +'"><div class="padding">'+((options.showPlaylistNumber)?current_obj.total_images+'. ':'')+current_obj.playlist_arr[current_obj.total_images-1]['title']+'</div></div>');
	            audio3_html5_thumbsHolder.append(thumbsHolder_Thumb);
				

            	thumbsHolder_Thumb.css({
					"top":(thumbsHolder_Thumb.height()+1)*current_obj.total_images+'px',
					"background":options.playlistRecordBgOffColor,
					"border-bottom-color":options.playlistRecordBottomBorderOffColor,
					"color":options.playlistRecordTextOffColor
				});				
	            
	            //activate first
	            if (current_obj.total_images===1) {
	            	//thumbsHolder_Thumb.addClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumb.css({
						"background":options.playlistRecordBgOnColor,
						"border-bottom-color":options.playlistRecordBottomBorderOnColor,
						"color":options.playlistRecordTextOnColor
					});
				}
           
	            
			});		
			
			audio3_html5_thumbsHolderWrapper.height(2*options.playlistPadding+(thumbsHolder_Thumb.height()+1)*((options.numberOfThumbsPerScreen<current_obj.total_images)?options.numberOfThumbsPerScreen:current_obj.total_images)); //thumbsHolder_Thumb.height()+1 - 1 is the border
	        audio3_html5_thumbsHolderVisibleWrapper.height((thumbsHolder_Thumb.height()+1)*((options.numberOfThumbsPerScreen<current_obj.total_images)?options.numberOfThumbsPerScreen:current_obj.total_images));	
			audio3_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});
			
            
			//the playlist scroller
			if (current_obj.total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {
				audio3_html5_sliderVertical.slider({
					orientation: "vertical",
					range: "min",
					min: 1,
					max: 100,
					step:1,
					value: 100,
					slide: function( event, ui ) {
						//alert( ui.value );
						carouselScroll(ui.value,current_obj,options,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder);
					}
				});
				audio3_html5_sliderVertical.css({
					'display':'inline',
					'position':'absolute',
					'height':audio3_html5_thumbsHolderWrapper.height()-16-2*options.playlistPadding+'px', // 16 is the height of  .slider-vertical.ui-slider .ui-slider-handle
					'left':audio3_html5_container.width()+2*options.playerPadding-audio3_html5_sliderVertical.width()-options.playlistPadding+'px',
					'top':current_obj.audioPlayerHeight+options.playlistTopPos+options.playlistPadding+'px'
				});
				
				if (!options.showPlaylistOnInit)
					audio3_html5_sliderVertical.css({
						'opacity': 0,
						'display':'none'
					});
					
				$('.thumbsHolder_ThumbOFF', audio3_html5_container).css({
					'width':audio3_html5_container.width()+2*options.playerPadding-audio3_html5_sliderVertical.width()-3*options.playlistPadding+'px'
				});						

            } else {
				$('.thumbsHolder_ThumbOFF', audio3_html5_container).css({
					'width':audio3_html5_container.width()+2*options.playerPadding-2*options.playlistPadding+'px'
				});					
			}
			
		

//alert (audio3_html5_container.css("top"));
			
			
			
			
			// mouse wheel
			audio3_html5_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
				var currentScrollVal=audio3_html5_sliderVertical.slider( "value");
				//alert (currentScrollVal+' -- '+delta);
				if ( (parseInt(currentScrollVal)>1 && parseInt(delta)==-1) || (parseInt(currentScrollVal)<100 && parseInt(delta)==1) ) {
					currentScrollVal = currentScrollVal + delta;
					audio3_html5_sliderVertical.slider( "value", currentScrollVal);
					carouselScroll(currentScrollVal,current_obj,options,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder)
					//alert (currentScrollVal);
				}
				
			});	
			
			//tumbs nav
			var thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', audio3_html5_container);
			thumbsHolder_Thumbs.css({
				"background":options.playlistRecordBgOffColor,
				"border-bottom-color":options.playlistRecordBottomBorderOffColor,
				"color":options.playlistRecordTextOffColor
			});

			thumbsHolder_Thumbs.click(function() {
				if (!current_obj.is_changeSrc) {	
					options.autoPlay=true;
					var currentBut=$(this);
					var i=currentBut.attr('rel');

					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});
					
					current_obj.current_img_no=i;
					setCookie(options,'cookie_current_img_no', current_obj.current_img_no);
					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_Audio);
				}
			});	
			
			
			thumbsHolder_Thumbs.mouseover(function() {
				var currentBut=$(this);
				currentBut.css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});				
			});
			
			
			thumbsHolder_Thumbs.mouseout(function() {
				var currentBut=$(this);
				var i=currentBut.attr('rel');
				if (current_obj.current_img_no!=i){
					currentBut.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});
				}
			});			
			
			
			//bottom positioning 
			//alert (current_obj.audioPlayerWidth+' --  '+current_obj.audioPlayerHeight+' --  '+options.playerPadding);
			/*var playerNewLeft=0;
			var theWindowWidth=audio3_html5_bottom_div.parent().width();
			var playerMarginLeft=0;
			switch(options.playerPossition) {
				case 'left':
					playerNewLeft=options.playerAdditionalLeftMargin;
					break;
				case 'center':
					//playerNewLeft=(theWindowWidth-audio3_html5_bottom_div.width())/2;
					playerNewLeft='50%';
					playerMarginLeft=(-1)*audio3_html5_bottom_div.width()/2+options.playerAdditionalLeftMargin;
					break;
				case 'right':
					//playerNewLeft=(theWindowWidth-audio3_html5_bottom_div.width());
					playerNewLeft='100%';
					playerMarginLeft=(-1)*audio3_html5_bottom_div.width()+options.playerAdditionalLeftMargin;
					break;				
				default:
					playerNewLeft=0;
					playerMarginLeft=options.playerAdditionalLeftMargin;
			} 
					


			*/
			
			positionPlayer(options,current_obj,audio3_html5_bottom_div,audio3_html5_thumbsHolderWrapper,audio3_closeBut);	
			audio3_html5_bottom_div.css ({
				'bottom':options.playerAdditionalBottomMargin+'3px',
				'left':current_obj.playerNewLeft,
				'margin-left':current_obj.playerMarginLeft+'px',
				'height':current_obj.audioPlayerHeight+options.playlistTopPos+audio3_html5_thumbsHolderWrapper.height()+'px'	
			});			
			
		    //close/show button
           
			audio3_closeBut.click(function() {
				var new_height=0;
				if (current_obj.isMinimized) {
					current_obj.isMinimized=false;
					generateAudioPlayer (current_obj,audio3_html5_Audio,audio3_html5_rewind_btn,audio3_html5_play_btn,audio3_html5_prev_btn,audio3_html5_next_btn,audio3_html5_shuffle_btn,audio3_html5_volumeMute_btn,audio3_html5_volumeSlider,audio3_html5_Audio_timer,audio3_html5_Audio_buffer,audio3_html5_Audio_seek,audio3_html5_AuthorTitle,audio3_html5_controls,audio3_html5_border,audio3_html5_container,audio3_html5_thumbsHolderWrapper,audio3_html5_AuthorTitleInside,audio3_html5_sliderVertical,audio3_closeBut,ver_ie,options,options.playerPadding,options.showRewindBut,options.showPlayBut,options.showPreviousBut,options.showNextBut,options.showShuffleBut,options.showVolumeBut,options.showVolumeSliderBut,options.showTimer,options.showSeekBar,options.showAuthor,options.showTitle,options.showPlaylist,options.showPlaylistOnInit);
					new_height=current_obj.audioPlayerHeight+options.playlistTopPos+audio3_html5_thumbsHolderWrapper.height();
				} else {
					current_obj.isMinimized=true;
					generateAudioPlayer (current_obj,audio3_html5_Audio,audio3_html5_rewind_btn,audio3_html5_play_btn,audio3_html5_prev_btn,audio3_html5_next_btn,audio3_html5_shuffle_btn,audio3_html5_volumeMute_btn,audio3_html5_volumeSlider,audio3_html5_Audio_timer,audio3_html5_Audio_buffer,audio3_html5_Audio_seek,audio3_html5_AuthorTitle,audio3_html5_controls,audio3_html5_border,audio3_html5_container,audio3_html5_thumbsHolderWrapper,audio3_html5_AuthorTitleInside,audio3_html5_sliderVertical,audio3_closeBut,ver_ie,options,3,false,true,false,false,false,true,true,false,false,false,false,false,false);
					new_height=audio3_html5_border.height()+4;
				}
				//alert(audio3_closeBut.height());
				
				//alert (audio3_html5_thumbsHolderWrapper.height());
				
				positionPlayer(options,current_obj,audio3_html5_bottom_div,audio3_html5_thumbsHolderWrapper,audio3_closeBut);
				audio3_html5_bottom_div.animate({
							'height':new_height+'px',
							'margin-left':current_obj.playerMarginLeft
					 }, current_obj.closeTime, 'easeOutQuint', function() {
							// Animation complete.
							
							audio3_html5_bottom_div.css ({
								'bottom':options.playerAdditionalBottomMargin+'px'
							});
							audio3_html5_bottom_div.css ({
								'bottom':options.playerAdditionalBottomMargin+'px'
							});		
					});
			});
			
			if (options.startMinified) {
				audio3_closeBut.click();
			}
			current_obj.closeTime=450;
			
			
			
			current_obj.cookie_initialVolume=getCookie(options,'cookie_initialVolume');
			if (current_obj.cookie_initialVolume) {
				options.initialVolume=current_obj.cookie_initialVolume;
			}
			//start initialize volume slider
			audio3_html5_volumeSlider.slider({
				value: options.initialVolume,
				step: 0.05,
				orientation: "horizontal",
				range: "min",
				max: 1,
				animate: true,					
				slide:function(e,ui){
						//document.getElementById(current_obj.audioID).muted=false;
						document.getElementById(current_obj.audioID).volume=ui.value;
						setCookie(options,'cookie_initialVolume', ui.value);
				},
				stop:function(e,ui){
					
				}
			});
			document.getElementById(current_obj.audioID).volume=options.initialVolume;
			audio3_html5_volumeSlider.css({'background':options.volumeOffColor});
			$(".ui-slider-range",audio3_html5_volumeSlider).css({'background':options.volumeOnColor});
			//end initialize volume slider			
			
			
			
			//buttons start
			audio3_html5_play_btn.click(function() {
				var is_paused=document.getElementById(current_obj.audioID).paused;
				cancelAll();
				if (is_paused == false) {
					document.getElementById(current_obj.audioID).pause();
					audio3_html5_play_btn.removeClass('AudioPause');
					setCookie(options,'cookie_autoPlay', false);
				} else {	
					document.getElementById(current_obj.audioID).play();
					audio3_html5_play_btn.addClass('AudioPause');
					setCookie(options,'cookie_autoPlay', true);
				}
			});
			
			audio3_html5_rewind_btn.click(function() {
				document.getElementById(current_obj.audioID).currentTime=0;
				cancelAll();
				document.getElementById(current_obj.audioID).play();
				audio3_html5_play_btn.addClass('AudioPause');
				//alert (document.getElementById(current_obj.audioID).playing);
			});
			
			audio3_html5_next_btn.click(function() {
				if (!current_obj.is_changeSrc || current_obj.is_very_first) {
					options.autoPlay=true;
					//$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});

					if (options.shuffle) {
						getRandomNumber(options,current_obj);
					} else {
						if (current_obj.current_img_no==current_obj.total_images-1)
							current_obj.current_img_no=0;
						else
							current_obj.current_img_no++;	
					}
						
						
					setCookie(options,'cookie_current_img_no', current_obj.current_img_no);	
							        	
					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_Audio);
				}
			});
			
			audio3_html5_prev_btn.click(function() {
				if (!current_obj.is_changeSrc || current_obj.is_very_first) {	
					options.autoPlay=true;
					//$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});

					if (options.shuffle) {
						getRandomNumber(options,current_obj);
					} else {
						if (current_obj.current_img_no-1<0)
							current_obj.current_img_no=current_obj.total_images-1;
						else
							current_obj.current_img_no--;
					}
						
					setCookie(options,'cookie_current_img_no', current_obj.current_img_no);

					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_Audio);
				}				
			});			
				

			audio3_html5_shuffle_btn.click(function() {
				if (options.shuffle) {
					audio3_html5_shuffle_btn.removeClass('AudioShuffleON');
					options.shuffle=false;
					setCookie(options,'cookie_shuffle', false);
				} else {
					audio3_html5_shuffle_btn.addClass('AudioShuffleON');
					options.shuffle=true;	
					setCookie(options,'cookie_shuffle', true);
				}		
			});
			
			audio3_html5_volumeMute_btn.click(function() {
				if (!document.getElementById(current_obj.audioID).muted) {
					document.getElementById(current_obj.audioID).muted=true;
					audio3_html5_volumeMute_btn.addClass('VolumeButtonMuted');
					setCookie(options,'cookie_muteVolume', 1);
				} else {
					document.getElementById(current_obj.audioID).muted=false;
					audio3_html5_volumeMute_btn.removeClass('VolumeButtonMuted');
					setCookie(options,'cookie_muteVolume', 0);
				}
			});
			//buttons end
			

			audio3_html5_thumbsHolder.swipe( {
				swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
				{
					//$('#logulmeu').html("phase: "+phase+"<br>direction: "+direction+"<br>distance: "+distance);
					if (direction=='up' || direction=='down') {
						if (distance!=0) {
							  currentScrollVal=audio3_html5_sliderVertical.slider( "value");
							  if (direction=="up") {
									currentScrollVal = currentScrollVal - 1.5;
							  } else {
									currentScrollVal = currentScrollVal + 1.5;
							  }
							  audio3_html5_sliderVertical.slider( "value", currentScrollVal);
							  //carouselScroll(currentScrollVal,current_obj,options,audio3_html5_thumbsHolder)
							  carouselScroll(currentScrollVal,current_obj,options,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder);
						}	  
					}
				  
				  //Here we can check the:
				  //phase : 'start', 'move', 'end', 'cancel'
				  //direction : 'left', 'right', 'up', 'down'
				  //distance : Distance finger is from initial touch point in px
				  //duration : Length of swipe in MS 
				  //fingerCount : the number of fingers used
				  },
				  
				  threshold:100,
				  maxTimeThreshold:500,
				  fingers:'all'
			});		
			
			
			
			//audio ended
			document.getElementById(current_obj.audioID).addEventListener('ended',function (){endAudioHandler(current_obj,options,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_next_btn,audio3_html5_Audio)
			});
		    	
			
			//initialize first Audio
			current_obj.cookie_timePlayed=getCookie(options,'cookie_timePlayed');
			current_obj.cookie_current_img_no=getCookie(options,'cookie_current_img_no');
			current_obj.cookie_autoPlay=getCookie(options,'cookie_autoPlay');
			current_obj.cookie_shuffle=getCookie(options,'cookie_shuffle');
			if (current_obj.cookie_current_img_no) {
				current_obj.current_img_no=current_obj.cookie_current_img_no;
			} else {
				if (options.shuffle) {
					getRandomNumber(options,current_obj);
					audio3_html5_shuffle_btn.addClass('AudioShuffleON');
				}
			}	
			if (current_obj.cookie_autoPlay!=undefined) {
				if (current_obj.cookie_autoPlay=='true')
					options.autoPlay=true;
				else
					options.autoPlay=false;
				//alert ("if: "+current_obj.cookie_autoPlay+'  -  '+options.autoPlay+'  -  '+current_obj.cookie_timePlayed);
			} else {
				//alert ("else: "+current_obj.cookie_autoPlay+'  -  '+options.autoPlay+'  -  '+current_obj.cookie_timePlayed);
			}
			
			
			
			if (current_obj.cookie_shuffle!=undefined) {
				if (current_obj.cookie_shuffle=='true') {
					options.shuffle=true;
					audio3_html5_shuffle_btn.addClass('AudioShuffleON');
				} else {
					options.shuffle=false;
					audio3_html5_shuffle_btn.removeClass('AudioShuffleON');
				}
				//alert ("if: "+current_obj.cookie_shuffle+'  -  '+options.shuffle);
			} else {
				//alert ("else: "+current_obj.cookie_shuffle+'  -  '+options.shuffle);
			}
			changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio3_html5_sliderVertical,audio3_html5_thumbsHolder,audio3_html5_container,audio3_html5_play_btn,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside,audio3_html5_Audio);
			
			current_obj.cookie_muteVolume=getCookie(options,'cookie_muteVolume');
			if (current_obj.cookie_muteVolume>=1) {
				audio3_html5_volumeMute_btn.click();
			}
			
			current_obj.timeupdateInterval=setInterval(function(){
					//alert (document.getElementById(current_obj.audioID).currentTime);
					seekUpdate(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio,audio3_html5_AuthorTitle,audio3_html5_AuthorTitleInside);
    		},300);	
			
			document.getElementById(current_obj.audioID).addEventListener("durationchange", function() {
				if (current_obj.is_changeSrc) {
					current_obj.totalTime = document.getElementById(current_obj.audioID).duration;
				}
			});
			
//firefox >31.0
						if (options.autoPlay) {
							cancelAll();
							document.getElementById(current_obj.audioID).play();
							//audio3_html5_play_btn.click();
							audio3_html5_play_btn.addClass('AudioPause');
						} else {
							audio3_html5_play_btn.removeClass('AudioPause');
						}
//firefox >31.0						
			
				document.getElementById(current_obj.audioID).addEventListener("canplay", function() {
					//alert (val);
					if (current_obj.cookie_timePlayed) {
						document.getElementById(current_obj.audioID).currentTime=current_obj.cookie_timePlayed;
						//alert (document.getElementById(current_obj.audioID).currentTime);
						current_obj.cookie_timePlayed=null;
					}
					//alert (document.getElementById(current_obj.audioID).currentTime);
					if (current_obj.userOS === 'iOS') {
						if (current_obj.totalTime != document.getElementById(current_obj.audioID).duration) {
							//seekbar init
							if (options.isSliderInitialized) {
								audio3_html5_Audio_seek.slider("destroy");
								options.isSliderInitialized=false;
							}
							if (options.isProgressInitialized) {
								audio3_html5_Audio_buffer.progressbar("destroy");
								options.isProgressInitialized=false;
							}
					
							current_obj.totalTime = document.getElementById(current_obj.audioID).duration;
							generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio);
							if (options.isProgressInitialized) {	
								audio3_html5_Audio_buffer.progressbar({ value: current_obj.audioPlayerWidth });
							}
						}
					}	
					
					//alert (options.autoPlay);
					if (val.indexOf("opera") != -1) {
						//nothing
					} else {
						//alert (options.autoPlay);
						if (options.autoPlay) {
							cancelAll();
							document.getElementById(current_obj.audioID).play();
							//audio3_html5_play_btn.click();
							audio3_html5_play_btn.addClass('AudioPause');
						} else {
							audio3_html5_play_btn.removeClass('AudioPause');
						}					
					}
					
				});
				
				
				/*document.getElementById(current_obj.audioID).oncanplaythrough=function() {
					//alert (current_obj.cookie_timePlayed+' -- '+options.autoPlay);
					if (current_obj.cookie_timePlayed) {
						document.getElementById(current_obj.audioID).currentTime=current_obj.cookie_timePlayed;
						//alert (document.getElementById(current_obj.audioID).currentTime);
						current_obj.cookie_timePlayed=null;
					}	
					
					if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
						if (current_obj.totalTime != document.getElementById(current_obj.audioID).duration) {
							//seekbar init
							if (options.isSliderInitialized) {
								audio3_html5_Audio_seek.slider("destroy");
								options.isSliderInitialized=false;
							}
							if (options.isProgressInitialized) {
								audio3_html5_Audio_buffer.progressbar("destroy");
								options.isProgressInitialized=false;
							}
					
							current_obj.totalTime = document.getElementById(current_obj.audioID).duration;
							generate_seekBar(current_obj,options,audio3_html5_container,audio3_html5_Audio_seek,audio3_html5_Audio_buffer,audio3_html5_Audio_timer,audio3_html5_play_btn,audio3_html5_Audio);
							if (options.isProgressInitialized) {	
								audio3_html5_Audio_buffer.progressbar({ value: current_obj.audioPlayerWidth });
							}
						}
					} 
					
					alert (options.autoPlay);
					if (options.autoPlay) {
						cancelAll();
						document.getElementById(current_obj.audioID).play();
						//audio3_html5_play_btn.click();
						audio3_html5_play_btn.addClass('AudioPause');
					} else {
						audio3_html5_play_btn.removeClass('AudioPause');
					}	

					
				}*/
				
				/*document.getElementById(current_obj.audioID).addEventListener("loadedmetadata", function() {
					alert (current_obj.cookie_timePlayed+' -- '+options.autoPlay);
					if (current_obj.cookie_timePlayed) {
						document.getElementById(current_obj.audioID).currentTime=current_obj.cookie_timePlayed;
						//alert (document.getElementById(current_obj.audioID).currentTime);
						current_obj.cookie_timePlayed=null;
						
						if (options.autoPlay) {
							cancelAll();
							document.getElementById(current_obj.audioID).play();
							//audio3_html5_play_btn.click();
							audio3_html5_play_btn.addClass('AudioPause');
						} else {
							audio3_html5_play_btn.removeClass('AudioPause');
						}						
					}
				});		*/		
			

		});
	};


	//
	// plugin customization variables
	//
	$.fn.audio3_html5.defaults = {
			skin: 'whiteControllers',
			initialVolume:0.5,
			autoPlay:true,
			loop:true,	
			shuffle:false,		
			playerPadding: 5,
			playerBg: '#000000',
			bufferEmptyColor: '#929292',
			bufferFullColor: '#454545',
			seekbarColor: '#ffffff',
			volumeOffColor: '#454545',
			volumeOnColor: '#ffffff',
			timerColor: '#ffffff',
			songAuthorTitleColor: '#fffff',
			
			showRewindBut:false, //removed
			showPlayBut:true,
			showPreviousBut:true,
			showNextBut:true,
			showShuffleBut:false,
			showVolumeBut:true,
			showVolumeSliderBut:true,
			showTimer:true,
			showSeekBar: true,
			showAuthor: true,
			showTitle: true,
			showPlaylist: true,
			showPlaylistOnInit:true, //removed

			playlistTopPos:0,
			playlistBgColor:'#000000',
			playlistRecordBgOffColor:'#000000',
			playlistRecordBgOnColor:'#333333',
			playlistRecordBottomBorderOffColor:'#333333',
			playlistRecordBottomBorderOnColor:'#FFFFFF',
			playlistRecordTextOffColor:'#777777',
			playlistRecordTextOnColor:'#FFFFFF',
			numberOfThumbsPerScreen:7,	
			playlistPadding:4,
			showPlaylistNumber:true,
			
			continuouslyPlayOnAllPages:true,
			
			playerAdditionalBottomMargin:1,
			playerAdditionalLeftMargin:1,
			playerPossition: 'left', //left, center, right
			startMinified:false,
			isSliderInitialized:false,
			isProgressInitialized:false

	};

})(jQuery);